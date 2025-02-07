import Image from "next/image";
import { formatBytes } from "@/lib/utils";

interface ImagePreviewProps {
  title: string;
  src?: string;
  fileSize?: number;
}

export default function ImagePreview({
  title,
  src,
  fileSize,
}: Readonly<ImagePreviewProps>) {
  return (
    <div className="rounded-lg border border-gray-700 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {fileSize !== undefined && (
          <span className="text-sm text-gray-400">{formatBytes(fileSize)}</span>
        )}
      </div>
      {src ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={`${title} image`}
          width={400}
          height={300}
          className="h-64 w-full rounded object-contain"
        />
      ) : (
        <div className="flex h-64 w-full items-center justify-center rounded bg-gray-800">
          <span className="text-gray-500">No image uploaded</span>
        </div>
      )}
    </div>
  );
}
