
import PostCard from "./PostCard";
import { useState } from "react";

const HomeFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
      speciesName: "Red-winged Blackbird",
      aiInfo: "The Red-winged Blackbird (Agelaius phoeniceus) is a passerine bird found in most of North America. Males are territorial and polygamous, with distinctive red and yellow shoulder patches.",
      userNotes: "Spotted this beautiful bird at the local wetlands this morning! The red patches were so vibrant in the sunlight.",
      userName: "NatureLover22",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      likes: 127,
      isLiked: false,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500",
      speciesName: "Monarch Butterfly",
      aiInfo: "The Monarch Butterfly (Danaus plexippus) is known for its incredible migration journey. These orange and black butterflies can travel thousands of miles during migration.",
      userNotes: "Found this beauty on my morning hike. Amazing how delicate yet resilient these creatures are!",
      userName: "WildlifeWatcher",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      likes: 89,
      isLiked: true,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
      speciesName: "Eastern Gray Squirrel",
      aiInfo: "Eastern Gray Squirrels (Sciurus carolinensis) are common in urban and suburban areas. They're excellent climbers and are known for their ability to remember thousands of hiding spots for food.",
      userNotes: "This little guy was so focused on burying his acorn, he didn't even notice me taking the photo!",
      userName: "UrbanExplorer",
      userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
      likes: 56,
      isLiked: false,
    },
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    console.log("Saving post:", postId);
    // TODO: Implement save to collection functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Semurg</h1>
          <p className="text-sm text-gray-600 text-center">Discover Wildlife with AI</p>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;
