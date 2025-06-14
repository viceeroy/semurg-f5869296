import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface PostHeaderProps {
  onClose: () => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
  postId: string;
  postUserId: string;
}

const PostHeader = ({ onClose, onEdit, onDelete, onInfo, postId, postUserId }: PostHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === postUserId;

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
        
        {(isOwner || onInfo) && (
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
            <DropdownMenuContent 
              align="end" 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 min-w-[140px] backdrop-blur-sm"
            >
              {isOwner && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onEdit?.(postId)}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-3 py-2"
                  >
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(postId)} 
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer px-3 py-2"
                  >
                    Delete Post
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem 
                onClick={() => onInfo?.(postId)}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-3 py-2"
              >
                Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default PostHeader;