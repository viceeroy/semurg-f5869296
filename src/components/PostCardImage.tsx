import OptimizedPostImage from "./OptimizedPostImage";
import { compressImageUrl } from "../utils/imageCompression";

interface PostCardImageProps {
  image: string;
  speciesName: string;
}

const PostCardImage = ({ image, speciesName }: PostCardImageProps) => {
  return (
    <div className="mb-4 -mx-0">
      <OptimizedPostImage
        src={compressImageUrl(image, 'medium')}
        alt={speciesName}
        className="w-full h-80"
        width={400}
      />
    </div>
  );
};

export default PostCardImage;