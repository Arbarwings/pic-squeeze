import ImagePreview from "./ImagePreview";

interface ImageDisplayProps {
  originalImage: { file: File; src: string } | null;
  compressedImage: { src: string; size: number } | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalImage,
  compressedImage,
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <ImagePreview
        title="Original"
        src={originalImage?.src ?? "/placeholder.svg"}
        fileSize={originalImage?.file.size}
      />
      <ImagePreview
        title="Compressed"
        src={compressedImage?.src ?? "/placeholder.svg"}
        fileSize={compressedImage?.size}
      />
    </div>
  );
};

export default ImageDisplay;
