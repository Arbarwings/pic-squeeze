import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useImageCompression = () => {
  const [originalImage, setOriginalImage] = useState<{
    file: File;
    src: string;
  } | null>(null);
  const [compressedImage, setCompressedImage] = useState<{
    src: string;
    size: number;
  } | null>(null);
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 80,
  });
  const { toast } = useToast();

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setOriginalImage({
            file,
            src: e.target.result as string,
          });
          setCompressedImage(null);
        }
      };
      reader.readAsDataURL(file);
    },
    [setOriginalImage, setCompressedImage],
  );

  const handleCompress = useCallback(async () => {
    if (!originalImage) {
      toast({
        variant: "destructive",
        title: "No image uploaded",
        description: "Please upload an image first",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", originalImage.file);
      formData.append("quality", String(compressionSettings.quality));

      const res = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          throw new Error(
            (data.errors as { message: string }[])
              .map((e) => e.message)
              .join(", "),
          );
        }
        throw new Error(data.error || "Upload failed");
      }

      // Get the compressed image as a Blob and create a preview URL.
      const blob = await res.blob();
      const compressedUrl = URL.createObjectURL(blob);
      setCompressedImage({ src: compressedUrl, size: blob.size });
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Compression failed",
        description: (err as Error).message,
      });
    }
  }, [originalImage, compressionSettings, toast, setCompressedImage]);

  const memoizedValues = useMemo(
    () => ({
      originalImage,
      compressedImage,
      compressionSettings,
      setCompressionSettings,
      handleFileUpload,
      handleCompress,
    }),
    [
      originalImage,
      compressedImage,
      compressionSettings,
      setCompressionSettings,
      handleFileUpload,
      handleCompress,
    ],
  );

  return memoizedValues;
};
