"use client";

import { Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { createFileSchema } from "@/lib/utils";
import FileWarning from "./FileWarning";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  maxSize?: number;
  acceptedTypes?: readonly string[];
}

export default function FileUpload({
  onFileUpload,
  maxSize = MAX_FILE_SIZE,
  acceptedTypes = ACCEPTED_MIME_TYPES,
}: Readonly<FileUploadProps>) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const schema = useMemo(
    () => createFileSchema(maxSize, acceptedTypes),
    [maxSize, acceptedTypes],
  );

  const validateAndUploadFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      const result = schema.safeParse({ image: file });

      if (!result.success) {
        setErrorMessage(result.error.errors[0].message);
        return;
      }

      setErrorMessage(undefined);
      onFileUpload(file);
    },
    [schema, onFileUpload],
  );

  const handleDragEvent = useCallback((e: DragEvent, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragging);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      handleDragEvent(e, false);
      validateAndUploadFile(e.dataTransfer.files[0]);
    },
    [handleDragEvent, validateAndUploadFile],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      validateAndUploadFile(e.target.files?.[0]);
    },
    [validateAndUploadFile],
  );

  return (
    <>
      <div
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 hover:border-gray-500"
        } `}
        onDragEnter={(e) => handleDragEvent(e, true)}
        onDragOver={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="sr-only"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          aria-label="File upload"
          aria-invalid={!!errorMessage}
        />
        <label
          htmlFor="fileInput"
          className="flex cursor-pointer flex-col items-center space-y-4"
        >
          <Upload
            className="h-12 w-12 text-blue-500 transition-transform group-hover:scale-110"
            aria-hidden="true"
          />
          <span className="text-lg font-semibold">
            Drag & drop your image here or click to browse
          </span>
          <span className="text-sm text-gray-400">
            {`Maximum file size: ${maxSize / (1024 * 1024)}MB`}
          </span>
        </label>
      </div>

      {errorMessage && (
        <FileWarning title="Invalid File" message={errorMessage} />
      )}
    </>
  );
}
