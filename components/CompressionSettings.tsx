"use client";

import { useCallback, useState } from "react";
import { Slider } from "@/components/ui/slider";

interface CompressionSettings {
  quality: number;
}

interface CompressionSettingsProps {
  onSettingsChange: (settings: CompressionSettings) => void;
}

export default function CompressionSettings({
  onSettingsChange,
}: Readonly<CompressionSettingsProps>) {
  const [quality, setQuality] = useState(80);

  const handleQualityChange = useCallback(
    (value: number[]) => {
      setQuality(value[0]);
      onSettingsChange({ quality: value[0] });
    },
    [onSettingsChange],
  );

  return (
    <div className="space-y-4 rounded-lg bg-gray-800 p-4">
      <h3 className="mb-2 text-lg font-semibold">Compression settings</h3>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          Quality: {quality}%
        </label>
        <Slider
          value={[quality]}
          onValueChange={handleQualityChange}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}
