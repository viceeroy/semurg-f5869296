import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
interface PostInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    title: string;
    userName: string;
    userAvatar: string;
    uploadDate: string;
    aiSource: string;
    location?: string;
    imageSize?: string;
  };
}
const PostInfoModal = ({
  isOpen,
  onClose,
  post
}: PostInfoModalProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-gray-200 dark:border-gray-700 shadow-xl z-[70] bg-slate-300 rounded">
        <DialogHeader>
          <DialogTitle>Post Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img src={post.userAvatar} alt={post.userName} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 className="font-semibold text-foreground">{post.userName}</h3>
              <p className="text-sm text-muted-foreground">Post Author</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Species Identified</h4>
              <p className="text-sm text-muted-foreground">{post.title}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Upload Date</h4>
              <p className="text-sm text-muted-foreground">{formatDate(post.uploadDate)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">AI Source</h4>
              <Badge variant="secondary" className="text-xs">
                {post.aiSource || 'OpenAI Vision API'}
              </Badge>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Post ID</h4>
              <p className="text-xs text-muted-foreground font-mono">{post.id}</p>
            </div>
            
            {post.location && <div>
                <h4 className="font-medium text-foreground">Location</h4>
                <p className="text-sm text-muted-foreground">{post.location}</p>
              </div>}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default PostInfoModal;