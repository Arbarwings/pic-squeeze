"use client";

import CompressButton from "@/components/CompressButton";
import CompressionSavings from "@/components/CompressionSavings";
import CompressionSettings from "@/components/CompressionSettings";
import DownloadButton from "@/components/DownloadButton";
import FileUpload from "@/components/FileUpload";
import ImageDisplay from "@/components/ImageDisplay";
import { useImageCompression } from "@/hooks/use-image-compression";

export default function Home() {
  const {
    originalImage,
    compressedImage,
    setCompressionSettings,
    handleFileUpload,
    handleCompress,
  } = useImageCompression();

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">PicSqueeze</h1>
        <div className="space-y-8">
          <FileUpload onFileUpload={handleFileUpload} />
          <ImageDisplay
            originalImage={originalImage}
            compressedImage={compressedImage}
          />
          <CompressionSettings onSettingsChange={setCompressionSettings} />
          <CompressButton
            onCompress={handleCompress}
            disabled={!originalImage}
          />
          {originalImage && compressedImage && (
            <>
              <CompressionSavings
                originalSize={originalImage.file.size}
                compressedSize={compressedImage.size}
              />
              <DownloadButton
                imageData={compressedImage.src}
                fileName={`compressed_${originalImage.file.name}`}
                disabled={!compressedImage}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
