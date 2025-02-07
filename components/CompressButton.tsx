"use client";

import { Loader2, Minimize2 } from "lucide-react";
import { useCallback, useState } from "react";

interface CompressButtonProps {
  onCompress: () => Promise<void>;
  disabled: boolean;
}

export default function CompressButton({
  onCompress,
  disabled,
}: Readonly<CompressButtonProps>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCompress = useCallback(async () => {
    setIsLoading(true);
    try {
      await onCompress();
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onCompress]);

  return (
    <button
      onClick={handleCompress}
      disabled={disabled || isLoading}
      className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : (
        <Minimize2 className="mr-2" />
      )}
      {isLoading ? "Compressing..." : "Compress image"}
    </button>
  );
}
