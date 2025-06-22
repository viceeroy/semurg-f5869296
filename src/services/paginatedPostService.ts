
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { mockPosts } from "@/data/mockPosts";

export interface PostsPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const fetchPostsPaginated = async (
  cursor: string | null = null,
  limit: number = 20
): Promise<PostsPage> => {
  console.log('fetchPostsPaginated called with cursor:', cursor, 'limit:', limit);
  
  try {
    let query = supabase
      .from('posts')
      .select(`
        id,
        user_id,
        title,
        description,
        caption,
        image_url,
        created_at,
        scientific_name,
        category,
        confidence,
        habitat,
        diet,
        behavior,
        conservation_status,
        identification_notes,
        profiles!posts_user_id_fkey (
          id,
          username,
          first_name,
          last_name,
          avatar_url
        ),
        likes (user_id),
        comments (
          id,
          user_id,
          content,
          created_at,
          profiles!comments_user_id_fkey (
            username,
            first_name,
            last_name
          )
        )
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Add cursor-based pagination
    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      // Return mock data for the first page if there's an error
      if (!cursor) {
        return {
          posts: mockPosts.slice(0, limit),
          nextCursor: mockPosts.length > limit ? mockPosts[limit - 1].created_at : null,
          hasMore: mockPosts.length > limit
        };
      }
      return { posts: [], nextCursor: null, hasMore: false };
    }

    const posts = data || [];
    
    // If no posts from database and this is the first page, use mock data
    if (posts.length === 0 && !cursor) {
      return {
        posts: mockPosts.slice(0, limit),
        nextCursor: mockPosts.length > limit ? mockPosts[limit - 1].created_at : null,
        hasMore: mockPosts.length > limit
      };
    }

    // Determine if there are more posts
    const hasMore = posts.length === limit;
    const nextCursor = hasMore && posts.length > 0 ? posts[posts.length - 1].created_at : null;

    return {
      posts,
      nextCursor,
      hasMore
    };
  } catch (error) {
    console.error('Error in fetchPostsPaginated:', error);
    // Return mock data for the first page on error
    if (!cursor) {
      return {
        posts: mockPosts.slice(0, limit),
        nextCursor: mockPosts.length > limit ? mockPosts[limit - 1].created_at : null,
        hasMore: mockPosts.length > limit
      };
    }
    return { posts: [], nextCursor: null, hasMore: false };
  }
};
