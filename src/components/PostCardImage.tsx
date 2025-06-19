import OptimizedPostImage from "./OptimizedPostImage";

interface PostCardImageProps {
  image: string;
  speciesName: string;
}

const PostCardImage = ({ image, speciesName }: PostCardImageProps) => {
  return (
    <div className="mb-4 -mx-0">
      <OptimizedPostImage
        src={image}
        alt={speciesName}
        className="w-full h-80"
        width={400}
      />
    </div>
  );
};

export default PostCardImage;