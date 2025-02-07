import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number) => {
  if (bytes <= 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export const createFileSchema = (
  maxSize: number,
  acceptedTypes: readonly string[],
) =>
  z.object({
    image: z
      .instanceof(File)
      .refine(
        (file) => file.size <= maxSize,
        (file) => ({
          message: `File size must be less than ${(
            maxSize /
            (1024 * 1024)
          ).toFixed(0)}MB. Got: ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        }),
      )
      .refine(
        (file) => acceptedTypes.includes(file.type),
        () => ({
          message: `Only ${acceptedTypes
            .map((t) => t.split("/")[1].toUpperCase())
            .join(", ")} files are accepted`,
        }),
      ),
  });
