"use client";

import { Download } from "lucide-react";
import { useCallback } from "react";

interface DownloadButtonProps {
  imageData: string;
  fileName: string;
  disabled: boolean;
}

export default function DownloadButton({
  imageData,
  fileName,
  disabled,
}: Readonly<DownloadButtonProps>) {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageData, fileName]);

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
    >
      <Download className="mr-2" />
      Download compressed image
    </button>
  );
}
