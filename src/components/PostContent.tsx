import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/postUtils";
import { DetailedPost } from "@/types/detailedPost";

interface PostContentProps {
  post: DetailedPost;
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="p-6 space-y-6">
      {/* User Header */}
      <div className="flex items-center space-x-3">
        <img 
          src={post.userAvatar} 
          alt={post.userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-foreground">{post.userName}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(post.uploadDate)}</p>
        </div>
      </div>

      {/* AI Identification Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{post.speciesName}</h2>
          {post.scientificName && (
            <p className="text-lg italic text-muted-foreground">{post.scientificName}</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">AI Identification Details</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{post.aiInfo}</p>
        </div>

        {post.characteristics && post.characteristics.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Key Characteristics</h4>
            <ul className="space-y-1">
              {post.characteristics.map((char, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                  {char}
                </li>
              ))}
            </ul>
          </div>
        )}

        {post.habitat && (
          <div>
            <h4 className="font-semibold text-foreground mb-1">Habitat</h4>
            <p className="text-sm text-muted-foreground">{post.habitat}</p>
          </div>
        )}

        {post.diet && (
          <div>
            <h4 className="font-semibold text-foreground mb-1">Diet</h4>
            <p className="text-sm text-muted-foreground">{post.diet}</p>
          </div>
        )}

        {post.behavior && (
          <div>
            <h4 className="font-semibold text-foreground mb-1">Behavior</h4>
            <p className="text-sm text-muted-foreground">{post.behavior}</p>
          </div>
        )}

        {post.conservationStatus && (
          <div>
            <h4 className="font-semibold text-foreground mb-1">Conservation Status</h4>
            <p className="text-sm text-muted-foreground">{post.conservationStatus}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="bg-secondary/50 border-border text-secondary-foreground hover:bg-secondary rounded-full px-3 py-1 text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      {/* User Caption */}
      {post.userNotes && (
        <div>
          <h4 className="font-semibold text-foreground mb-2">Caption</h4>
          <p className="text-sm text-foreground">{post.userNotes}</p>
        </div>
      )}
    </div>
  );
};

export default PostContent;