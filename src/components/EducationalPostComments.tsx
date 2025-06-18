import PostComments from "@/components/PostComments";

interface EducationalPostCommentsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EducationalPostComments = ({ postId, isOpen, onClose }: EducationalPostCommentsProps) => {
  return (
    <PostComments
      postId={postId}
      isOpen={isOpen}
      onClose={onClose}
      isEducationalPost={true}
    />
  );
};

export default EducationalPostComments;