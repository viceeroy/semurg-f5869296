import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caption: string, hashtags: string) => void;
  currentCaption: string;
  currentHashtags: string;
  postTitle: string;
}

const EditCaptionModal = ({ isOpen, onClose, onSave, currentCaption, currentHashtags, postTitle }: EditCaptionModalProps) => {
  const [caption, setCaption] = useState(currentCaption);
  const [hashtags, setHashtags] = useState(currentHashtags);

  const handleSave = () => {
    onSave(caption, hashtags);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-[70]">
        <DialogHeader>
          <DialogTitle>Edit Post - {postTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="caption" className="text-sm font-medium">
              Caption
            </Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="hashtags" className="text-sm font-medium">
              Hashtags
            </Label>
            <Textarea
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#wildlife #nature #discovery"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCaptionModal;