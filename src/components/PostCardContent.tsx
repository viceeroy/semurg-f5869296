import { Button } from "@/components/ui/button";
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
  return <div className="mb-4 px-4">
      <h4 className="font-bold text-foreground mb-2">AI Identification</h4>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {aiInfo}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => <Button key={index} variant="outline" size="sm" className="bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200 rounded-full px-3 py-1 text-xs">
            {tag}
          </Button>)}
      </div>

      {/* User Caption */}
      {userNotes && <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-sm text-foreground">
            <span className="font-semibold mr-2">{userName}:</span>
            {userNotes}
          </p>
        </div>}
    </div>;
};
export default PostCardContent;