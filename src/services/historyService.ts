import { supabase } from "@/integrations/supabase/client";

export interface HistoryItem {
  id: string;
  user_id: string;
  post_id?: string;
  educational_post_id?: string;
  action_type: 'view' | 'identify' | 'like' | 'comment';
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  created_at: string;
}

export const addToHistory = async (
  userId: string,
  actionType: 'view' | 'identify' | 'like' | 'comment',
  title: string,
  options: {
    postId?: string;
    educationalPostId?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
  } = {}
) => {
  try {
    const { error } = await supabase
      .from('user_history')
      .insert({
        user_id: userId,
        post_id: options.postId,
        educational_post_id: options.educationalPostId,
        action_type: actionType,
        title: title,
        description: options.description,
        image_url: options.imageUrl,
        category: options.category
      });

    if (error) {
      console.error('Error adding to history:', error);
      return { error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to history:', error);
    return { error };
  }
};

export const fetchUserHistory = async (userId: string): Promise<HistoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }

    return (data || []) as HistoryItem[];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const clearUserHistory = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing history:', error);
      return { error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error clearing history:', error);
    return { error };
  }
};