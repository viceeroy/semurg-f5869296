
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { mockPosts } from "@/data/mockPosts";
import { advancedCache } from "@/hooks/useAdvancedCache";

// Optimized post fetching with minimal data transfer
export const fetchPosts = async (page: number = 0, pageSize: number = 10): Promise<Post[]> => {
  console.log('Optimized fetchPosts called', { page, pageSize });
  
  const cacheKey = `posts-${page}-${pageSize}`;
  
  // Check cache first
  const cachedPosts = advancedCache.get<Post[]>(cacheKey);
  if (cachedPosts) {
    console.log('Returning cached posts');
    return cachedPosts;
  }

  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    // Optimized query - only fetch essential data
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        title,
        description,
        image_url,
        caption,
        category,
        created_at,
        confidence,
        scientific_name,
        profiles!inner (
          username, 
          first_name, 
          last_name, 
          avatar_url
        ),
        likes!inner (count),
        comments!inner (
          id,
          user_id,
          content,
          created_at,
          profiles (username, first_name, last_name)
        )
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Database error:', error);
      // Return mock posts only for first page during development
      if (page === 0) {
        const mockData = mockPosts.slice(0, pageSize);
        advancedCache.set(cacheKey, mockData, 60000); // Cache for 1 minute
        return mockData;
      }
      return [];
    }

    // Transform data to match expected format
    const transformedData = (data || []).map(post => ({
      ...post,
      likes: Array.isArray(post.likes) ? post.likes : [],
      comments: Array.isArray(post.comments) ? post.comments : []
    }));

    // Cache successful results
    if (transformedData.length > 0) {
      advancedCache.set(cacheKey, transformedData, 300000); // Cache for 5 minutes
    }

    return transformedData;
  } catch (error) {
    console.error('Service error:', error);
    if (page === 0) {
      const mockData = mockPosts.slice(0, pageSize);
      advancedCache.set(cacheKey, mockData, 60000);
      return mockData;
    }
    return [];
  }
};

// Preload next page for better UX
export const preloadNextPage = async (currentPage: number, pageSize: number) => {
  const nextPage = currentPage + 1;
  const cacheKey = `posts-${nextPage}-${pageSize}`;
  
  // Only preload if not already cached
  if (!advancedCache.get(cacheKey)) {
    console.log('Preloading next page:', nextPage);
    try {
      await fetchPosts(nextPage, pageSize);
    } catch (error) {
      console.log('Preload failed, but that is okay:', error);
    }
  }
};

// Get post count for pagination
export const getPostCount = async (): Promise<number> => {
  const cacheKey = 'post-count';
  const cached = advancedCache.get<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_private', false);

    if (error) {
      console.error('Error getting post count:', error);
      return 100; // Fallback estimate
    }

    const totalCount = count || 0;
    advancedCache.set(cacheKey, totalCount, 60000); // Cache for 1 minute
    return totalCount;
  } catch (error) {
    console.error('Error counting posts:', error);
    return 100;
  }
};
