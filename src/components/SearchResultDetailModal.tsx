import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SearchPost } from "@/data/mockSearchPosts";
import { X } from "lucide-react";

interface SearchResultDetailModalProps {
  post: SearchPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const SearchResultDetailModal = ({ post, isOpen, onClose }: SearchResultDetailModalProps) => {
  if (!post) return null;

  const categoryColors = {
    birds: "bg-blue-100 text-blue-700",
    mammals: "bg-orange-100 text-orange-700", 
    insects: "bg-green-100 text-green-700",
    plants: "bg-emerald-100 text-emerald-700",
    reptiles: "bg-yellow-100 text-yellow-700",
    fish: "bg-cyan-100 text-cyan-700"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
          <DialogTitle className="text-xl font-bold pr-8">{post.title}</DialogTitle>
          <p className="text-sm text-gray-600 italic">{post.scientific_name}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Badge 
              className={`absolute top-2 right-2 ${categoryColors[post.category]}`}
            >
              {post.category}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.username}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{post.profiles.username}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700">{post.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Habitat</h3>
            <p className="text-sm text-gray-700">{post.habitat}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Diet & Feeding</h3>
            <p className="text-sm text-gray-700">{post.diet}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Behavior</h3>
            <p className="text-sm text-gray-700">{post.behavior}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Conservation Status</h3>
            <p className="text-sm text-gray-700">{post.conservation_status}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Interesting Facts</h3>
            <p className="text-sm text-gray-700">{post.interesting_facts}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Identification Notes</h3>
            <p className="text-sm text-gray-700">{post.identification_notes}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultDetailModal;