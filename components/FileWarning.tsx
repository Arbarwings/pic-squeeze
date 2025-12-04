import { AlertCircle } from "lucide-react";

interface FileWarningProps {
  title: string;
  message: string;
}

export default function FileWarning({
  title,
  message,
}: Readonly<FileWarningProps>) {
  return (
    <div
      className="flex items-center space-x-2 rounded-lg border-l-4 border-yellow-500 bg-yellow-900 p-4 text-yellow-200"
      role="alert"
    >
      <AlertCircle className="shrink-0" />
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
