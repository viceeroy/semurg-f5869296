import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostCardContentProps {
  aiInfo: string;
  tags: string[];
  userNotes: string;
  userName: string;
}

const PostCardContent = ({
  aiInfo,
  tags,
  userNotes,
  userName
}: PostCardContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = aiInfo.length > 200;
  const displayText = shouldTruncate && !isExpanded 
    ? `${aiInfo.substring(0, 200)}...` 
    : aiInfo;

  return (
    <div className="mb-4 px-6">
      <h4 className="font-bold text-foreground mb-2">AI Identification</h4>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {displayText}
      </p>
      
      {shouldTruncate && !isExpanded && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering post click
            setIsExpanded(true);
          }}
          className="text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors mb-3"
        >
          Read more →
        </button>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className="bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200 rounded-full px-3 py-1 text-xs"
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* User Caption */}
      {userNotes && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-sm text-foreground">
            <span className="font-semibold mr-2">{userName}:</span>
            {userNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostCardContent;