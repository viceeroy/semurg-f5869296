import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface PostCardHeaderProps {
  userName: string;
  userAvatar: string;
  speciesName: string;
  postId: string;
  postUserId: string;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onInfo?: (postId: string) => void;
}

const PostCardHeader = ({ userName, userAvatar, speciesName, postId, postUserId, onEdit, onDelete, onInfo }: PostCardHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === postUserId;

  return (
    <>
      {/* User Info Row */}
      <div className="flex items-center mb-4 px-4 pt-4">
        <img 
          src={userAvatar} 
          alt={userName}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{userName}</h3>
          <p className="text-xs text-emerald-600 font-medium">{speciesName}</p>
        </div>
        
        {(isOwner || onInfo) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-background border border-border rounded-xl shadow-lg z-[60] min-w-[150px]"
              sideOffset={5}
            >
              {isOwner && (
                <>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(postId); }}
                    className="cursor-pointer hover:bg-accent px-3 py-2"
                  >
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(postId); }}
                    className="cursor-pointer hover:bg-accent px-3 py-2 text-red-600"
                  >
                    Delete Post
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onInfo?.(postId); }}
                className="cursor-pointer hover:bg-accent px-3 py-2"
              >
                Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

export default PostCardHeader;