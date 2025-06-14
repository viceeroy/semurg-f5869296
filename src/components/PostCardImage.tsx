interface PostCardImageProps {
  image: string;
  speciesName: string;
}

const PostCardImage = ({ image, speciesName }: PostCardImageProps) => {
  return (
    <div className="mb-4 -mx-0">
      <img
        src={image}
        alt={speciesName}
        className="w-full h-80 object-cover"
      />
    </div>
  );
};

export default PostCardImage;