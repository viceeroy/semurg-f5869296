
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { mockPosts } from "@/data/mockPosts";

// Simple in-memory cache for posts
let postsCache: Post[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchPosts = async (limit: number = 20, offset: number = 0): Promise<Post[]> => {
  console.log('postService fetchPosts called with limit:', limit, 'offset:', offset);
  
  // Check cache first for initial load
  if (offset === 0 && postsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('Returning cached posts');
    return postsCache.slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        description,
        image_url,
        category,
        created_at,
        user_id,
        profiles!inner (username, avatar_url),
        likes (user_id),
        comments (
          id,
          user_id,
          content,
          created_at,
          profiles (username)
        )
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return offset === 0 ? mockPosts.slice(0, limit) : [];
    }

    const posts = data && data.length > 0 ? data as Post[] : (offset === 0 ? mockPosts.slice(0, limit) : []);
    
    // Cache only the initial load
    if (offset === 0 && posts.length > 0) {
      postsCache = posts;
      cacheTimestamp = Date.now();
    }

    return posts;
  } catch (error) {
    console.error('Error:', error);
    return offset === 0 ? mockPosts.slice(0, limit) : [];
  }
};

// Clear cache when needed
export const clearPostsCache = () => {
  postsCache = null;
  cacheTimestamp = 0;
};
