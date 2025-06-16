import { useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEducationalPostComments } from "@/hooks/useEducationalPostComments";
import CommentsList from "@/components/CommentsList";
import CommentInput from "@/components/CommentInput";

interface EducationalPostCommentsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EducationalPostComments = ({ postId, isOpen, onClose }: EducationalPostCommentsProps) => {
  const {
    comments,
    newComment,
    setNewComment,
    loading,
    submitting,
    handleSubmitComment,
    user
  } = useEducationalPostComments(postId, isOpen);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100]"
          />
          
          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] max-w-md mx-auto"
          >
            <div className="bg-background rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl border-t border-l border-r border-border">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Comments {comments.length > 0 && `(${comments.length})`}
                  </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4 min-h-0">
                <CommentsList comments={comments} loading={loading} />
              </div>

              {/* Comment Input */}
              <div className="border-t border-border bg-background">
                <CommentInput
                  user={user}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  submitting={submitting}
                  onSubmit={handleSubmitComment}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EducationalPostComments;