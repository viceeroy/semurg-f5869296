export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

export interface DetailedPost {
  id: string;
  image: string;
  speciesName: string;
  scientificName?: string;
  aiInfo: string;
  userNotes: string;
  userName: string;
  userAvatar: string;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
  tags: string[];
  badge?: string;
  comments: Comment[];
  uploadDate: string;
  characteristics?: string[];
  habitat?: string;
  diet?: string;
  behavior?: string;
  conservationStatus?: string;
}