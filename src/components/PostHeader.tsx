import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  onClose: () => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
  postId: string;
}

const PostHeader = ({ onClose, onEdit, onDelete, onInfo, postId }: PostHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-foreground hover:bg-accent"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent"
            >
              <MoreHorizontal className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-border rounded-xl shadow-lg z-50">
            <DropdownMenuItem onClick={() => onEdit?.(postId)}>
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(postId)}>
              Delete Post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onInfo?.(postId)}>
              Info
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostHeader;