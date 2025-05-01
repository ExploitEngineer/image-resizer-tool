"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onImageLoaded: (file: File, url: string) => void;
}

export function ImageUploader({ onImageLoaded }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onImageLoaded(file, url);
      }
    },
    [onImageLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border border-dashed border-white/30 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition",
        isDragActive ? "bg-white/10" : "hover:bg-white/5"
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-8 h-8 text-white mb-2" />
      <p className="text-sm text-white">
        Drag & drop an image here, or click to select
      </p>
      <p className="text-xs text-white/70 mt-1">
        Accepted: PNG, JPG, JPEG, WEBP
      </p>
    </div>
  );
}
