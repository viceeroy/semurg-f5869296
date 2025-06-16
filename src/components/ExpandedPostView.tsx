import { X, Heart, MessageCircle, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EducationalPost } from "@/services/educationalPostService";
import EducationalPostComments from "./EducationalPostComments";
import { useState } from "react";

interface ExpandedPostViewProps {
  post: EducationalPost;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const ExpandedPostView = ({ 
  post, 
  onClose, 
  onLike, 
  onComment, 
  onShare 
}: ExpandedPostViewProps) => {
  const [showComments, setShowComments] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'animals': return 'bg-orange-100 text-orange-800';
      case 'birds': return 'bg-blue-100 text-blue-800';
      case 'plants': return 'bg-green-100 text-green-800';
      case 'marine': return 'bg-cyan-100 text-cyan-800';
      case 'insects': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="pr-10">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
              {post.post_type === 'species-info' && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                  Species Info
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Content */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(post.id)}
                className={`gap-2 ${post.is_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
              >
                <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
                <span>{post.likes_count || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="gap-2 text-gray-600 hover:text-blue-500"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments_count || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(post.id)}
                className="gap-2 text-gray-600 hover:text-green-500"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="pt-4 border-t border-gray-100">
              <EducationalPostComments 
                postId={post.id}
                isOpen={showComments}
                onClose={() => setShowComments(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpandedPostView;