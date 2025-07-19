import OptimizedPostImage from "./OptimizedPostImage";

interface PostCardImageProps {
  image: string;
  speciesName: string;
}

const PostCardImage = ({ image, speciesName }: PostCardImageProps) => {
  // Fast URL optimization for Unsplash images only
  const optimizedUrl = image.includes('unsplash.com') 
    ? `${image}&w=400&q=75&auto=format` 
    : image;

  return (
    <div className="mb-4 -mx-0">
      <OptimizedPostImage
        src={optimizedUrl}
        alt={speciesName}
        className="w-full h-80"
        width={400}
      />
    </div>
  );
};

export default PostCardImage;