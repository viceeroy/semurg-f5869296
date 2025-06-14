import { supabase } from "@/integrations/supabase/client";

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  postId?: string,
  fromUserId?: string
) => {
  try {
    const { data, error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_type: type,
      p_title: title,
      p_message: message,
      p_post_id: postId,
      p_from_user_id: fromUserId
    });

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};