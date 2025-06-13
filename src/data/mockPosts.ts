import { Post } from "@/types/post";

export const mockPosts: Post[] = [
  {
    id: 'mock-1',
    user_id: 'mock-user-1',
    title: 'Northern Cardinal',
    description: 'A beautiful male Northern Cardinal spotted in Central Park. These vibrant red birds are year-round residents and are known for their distinctive crest and melodious song.',
    image_url: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=800',
    created_at: '2024-01-15T10:30:00Z',
    profiles: { username: 'BirdWatcher92', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' },
    likes: [{ user_id: 'user1' }, { user_id: 'user2' }],
    comments: []
  },
  {
    id: 'mock-2',
    user_id: 'mock-user-2',
    title: 'White-tailed Deer',
    description: 'A graceful white-tailed deer foraging in the early morning mist. Notice the characteristic white underside of the tail that gives this species its name.',
    image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    created_at: '2024-01-14T07:45:00Z',
    profiles: { username: 'NatureExplorer', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    likes: [{ user_id: 'user3' }],
    comments: []
  },
  {
    id: 'mock-3',
    user_id: 'mock-user-3',
    title: 'Great Blue Heron',
    description: 'Majestic Great Blue Heron patiently hunting in shallow water. These impressive wading birds can stand motionless for hours waiting for the perfect moment to strike.',
    image_url: 'https://images.unsplash.com/photo-1558618066-fcd25c85cd64?w=800',
    created_at: '2024-01-13T16:20:00Z',
    profiles: { username: 'WildlifePhotog', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    likes: [{ user_id: 'user1' }, { user_id: 'user3' }, { user_id: 'user4' }],
    comments: []
  },
  {
    id: 'mock-4',
    user_id: 'mock-user-4',
    title: 'Wild Sunflower',
    description: 'Beautiful wild sunflowers blooming in the prairie. These native plants provide important food for birds and pollinators throughout the summer and fall.',
    image_url: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800',
    created_at: '2024-01-12T14:30:00Z',
    profiles: { username: 'PlantLover', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    likes: [{ user_id: 'user2' }, { user_id: 'user4' }],
    comments: []
  },
  {
    id: 'mock-5',
    user_id: 'mock-user-5',
    title: 'Red Fox',
    description: 'An elusive red fox spotted at dawn in the forest. These intelligent mammals are known for their adaptability and cunning hunting techniques.',
    image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800',
    created_at: '2024-01-11T06:15:00Z',
    profiles: { username: 'ForestWanderer', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    likes: [{ user_id: 'user1' }, { user_id: 'user2' }, { user_id: 'user3' }, { user_id: 'user5' }],
    comments: []
  }
];