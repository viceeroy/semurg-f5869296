import { supabase } from "@/integrations/supabase/client";

export interface EducationalPost {
  id: string;
  title: string;
  content: string;
  category: string;
  post_type: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
}

export const fetchEducationalPosts = async (searchQuery?: string, category?: string, language?: string): Promise<EducationalPost[]> => {
  try {
    let query = supabase
      .from('educational_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
    }

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Filter by language
    if (language) {
      query = query.eq('language', language === 'uz' ? 'uzbek' : 'english');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching educational posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const likeEducationalPost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('educational_post_likes')
      .insert({ post_id: postId, user_id: userId });

    if (error) {
      console.error('Error liking post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const unlikeEducationalPost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('educational_post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error unliking post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const addEducationalPostComment = async (postId: string, userId: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('educational_post_comments')
      .insert({ post_id: postId, user_id: userId, content });

    if (error) {
      console.error('Error adding comment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const fetchEducationalPostLikes = async (userId: string): Promise<string[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('educational_post_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching likes:', error);
      return [];
    }

    return data.map(like => like.post_id);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};