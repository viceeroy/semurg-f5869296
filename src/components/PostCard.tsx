
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: {
    id: string;
    image: string;
    speciesName: string;
    aiInfo: string;
    userNotes: string;
    userName: string;
    userAvatar: string;
    likes: number;
    isLiked: boolean;
  };
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
}

const PostCard = ({ post, onLike, onSave }: PostCardProps) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center p-4 pb-3">
        <img
          src={post.userAvatar}
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{post.userName}</h3>
          <p className="text-sm text-gray-600">{post.speciesName}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.image}
          alt={post.speciesName}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={`p-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
          >
            <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-800">
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave(post.id)}
          className="p-2 text-gray-600 hover:text-nature-green"
        >
          <Bookmark className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="font-semibold text-gray-900 mb-1">{post.likes} likes</p>
        
        {/* AI Info */}
        <div className="bg-nature-green/10 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-800 font-medium mb-1">AI Identification:</p>
          <p className="text-sm text-gray-700">{post.aiInfo}</p>
        </div>

        {/* User Notes */}
        {post.userNotes && (
          <p className="text-sm text-gray-800">
            <span className="font-semibold mr-2">{post.userName}</span>
            {post.userNotes}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostCard;
