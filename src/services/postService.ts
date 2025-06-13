import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { mockPosts } from "@/data/mockPosts";

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (username, avatar_url),
        likes (user_id),
        comments (
          id,
          user_id,
          content,
          created_at,
          profiles (username)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return mockPosts;
    }

    return data && data.length > 0 ? data : mockPosts;
  } catch (error) {
    console.error('Error:', error);
    return mockPosts;
  }
};