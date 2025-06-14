import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchPost } from "@/data/mockSearchPosts";

interface SearchResultCardProps {
  post: SearchPost;
  onClick: () => void;
}

const SearchResultCard = ({ post, onClick }: SearchResultCardProps) => {
  const categoryColors = {
    birds: "bg-blue-100 text-blue-700",
    mammals: "bg-orange-100 text-orange-700", 
    insects: "bg-green-100 text-green-700",
    plants: "bg-emerald-100 text-emerald-700",
    reptiles: "bg-yellow-100 text-yellow-700",
    fish: "bg-cyan-100 text-cyan-700"
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 glass-card"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <Badge 
          className={`absolute top-2 right-2 ${categoryColors[post.category]}`}
        >
          {post.category}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
        </div>
        <p className="text-xs text-gray-600 italic">{post.scientific_name}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 line-clamp-3">
          {post.description.length > 120 ? 
            post.description.substring(0, 120) + '...' : 
            post.description
          }
        </p>
        <div className="flex items-center mt-3 text-xs text-gray-500">
          <img
            src={post.profiles.avatar_url}
            alt={post.profiles.username}
            className="w-4 h-4 rounded-full mr-2"
          />
          <span>{post.profiles.username}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;