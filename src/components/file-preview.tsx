"use client";

import { memo, useCallback } from "react";
import { X } from "lucide-react";

interface FilePreviewProps {
  files: File[];
  filePreviews: { [key: string]: string };
  onRemoveFile: (index: number) => void;
  onImageClick: (imageUrl: string) => void;
}

export const FilePreview = memo(
  ({ files, filePreviews, onRemoveFile, onImageClick }: FilePreviewProps) => {
    return (
      <div className="flex flex-wrap gap-2 p-0 pb-1 transition-all duration-300">
        {files.map((file, index) => {
          const handleImageClick = useCallback(() => {
            onImageClick(filePreviews[file.name]);
          }, [file.name]);

          const handleRemoveClick = useCallback(
            (e: React.MouseEvent) => {
              e.stopPropagation();
              onRemoveFile(index);
            },
            [index],
          );

          return (
            <div key={index} className="group relative">
              {file.type.startsWith("image/") && filePreviews[file.name] && (
                <div
                  className="h-16 w-16 cursor-pointer overflow-hidden rounded-xl transition-all duration-300"
                  onClick={handleImageClick}
                >
                  <img
                    src={filePreviews[file.name] || "/placeholder.svg"}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={handleRemoveClick}
                    className="bg-background/70 absolute top-1 right-1 rounded-full p-0.5 opacity-100 transition-opacity"
                  >
                    <X className="text-foreground h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

FilePreview.displayName = "FilePreview";
