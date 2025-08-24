import Image from "./Image";

const PostImage = ({ src, alt }) => {
  return (
    <Image src={src} alt={alt}
      className="w-full max-w-[600px] h-auto max-h-[800px] object-cover rounded-xl mx-auto my-3 shadow-md"
    />
  );
};

export default PostImage;