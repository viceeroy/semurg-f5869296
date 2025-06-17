-- Create user_history table to track what users have identified/viewed
CREATE TABLE public.user_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID,
  educational_post_id UUID,
  action_type TEXT NOT NULL, -- 'view', 'identify', 'like', 'comment'
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user history
CREATE POLICY "Users can view their own history" 
ON public.user_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" 
ON public.user_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history" 
ON public.user_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_history_user_id ON public.user_history(user_id);
CREATE INDEX idx_user_history_created_at ON public.user_history(created_at DESC);