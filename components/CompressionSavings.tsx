"use client";

import { ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";

interface CompressionSavingsProps {
  originalSize: number;
  compressedSize: number;
}

export default function CompressionSavings({
  originalSize,
  compressedSize,
}: Readonly<CompressionSavingsProps>) {
  const [savedPercentage, setSavedPercentage] = useState(0);

  useEffect(() => {
    if (originalSize > 0 && compressedSize > 0) {
      const saved = originalSize - compressedSize;
      const percentage = (saved / originalSize) * 100;
      setSavedPercentage(Math.max(0, Math.round(percentage))); // Ensure percentage is not negative
    }
  }, [originalSize, compressedSize]);

  if (originalSize === 0 || compressedSize === 0) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between rounded-lg border border-blue-500 bg-blue-500 bg-opacity-20 p-4">
      <div className="flex items-center space-x-4">
        <ArrowDownCircle className="h-8 w-8 text-blue-500" />
        <div>
          <h3 className="text-xl font-semibold">Space saved</h3>
          <p className="text-gray-400">
            {formatBytes(originalSize - compressedSize)} ({savedPercentage}%)
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">
          Original: {formatBytes(originalSize)}
        </p>
        <p className="text-sm text-gray-400">
          Compressed: {formatBytes(compressedSize)}
        </p>
      </div>
    </div>
  );
}
