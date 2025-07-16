import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { mockPosts } from "@/data/mockPosts";

export const fetchPosts = async (page: number = 0, pageSize: number = 10): Promise<Post[]> => {
  console.log('postService fetchPosts called', { page, pageSize });
  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (username, first_name, last_name, avatar_url),
        likes (user_id),
        comments (
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
      console.error('Error fetching posts:', error);
      // Only return mock posts for the first page
      return page === 0 ? mockPosts.slice(0, pageSize) : [];
    }

    // If no data and it's the first page, return mock posts
    if ((!data || data.length === 0) && page === 0) {
      return mockPosts.slice(0, pageSize);
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return page === 0 ? mockPosts.slice(0, pageSize) : [];
  }
};