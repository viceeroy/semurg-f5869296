export interface Post {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: { user_id: string }[];
  comments: {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
    };
  }[];
  _count?: {
    likes: number;
  };
}