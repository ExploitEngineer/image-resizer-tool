"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  imageURL: string;
  imageName: string;
}

export function ImageEditor({ imageURL, imageName }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCropped, setIsCropped] = useState(false);
  const [format, setFormat] = useState("png");

  useEffect(() => {
    if (
      !completedCrop ||
      !imageRef.current ||
      !previewCanvasRef.current ||
      !isCropped
    )
      return;

    const image = imageRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
  }, [completedCrop, isCropped]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width: naturalWidth,
      height: naturalHeight,
    });
    setIsCropped(false);
  };

  const handleSave = () => {
    setIsCropped(true);
  };

  const downloadImage = () => {
    if (!previewCanvasRef.current || !isCropped) return;
    const canvas = previewCanvasRef.current;
    const link = document.createElement("a");

    const nameWithoutExt = imageName?.split(".")[0] ?? "image";
    link.download = `${nameWithoutExt}-cropped.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {completedCrop && (
          <p>
            Width: {Math.round(completedCrop.width)}px, Height:{" "}
            {Math.round(completedCrop.height)}px
          </p>
        )}
      </div>

      <div
        className="w-full max-w-[900px] h-[600px] overflow-auto border rounded-md"
        style={{ backgroundColor: "#000" }}
      >
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);
            setIsCropped(false);
          }}
          onComplete={(c) => setCompletedCrop(c)}
          keepSelection
        >
          <img
            ref={imageRef}
            src={imageURL}
            alt="Uploaded"
            onLoad={onImageLoad}
            className="object-contain max-w-full max-h-full"
            style={{ display: "block", margin: "auto" }}
          />
        </ReactCrop>
      </div>

      <canvas ref={previewCanvasRef} style={{ display: "none" }} />

      <div className="flex flex-wrap gap-2 items-center">
        <Button
          onClick={handleSave}
          disabled={isCropped}
          className="bg-black text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
        >
          Save Crop
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-black text-white dark:bg-white dark:text-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Format: {format.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["png", "jpg", "webp"].map((f) => (
              <DropdownMenuItem key={f} onClick={() => setFormat(f)}>
                {f.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={downloadImage}
          disabled={!isCropped}
          className="bg-black text-white dark:bg-white dark:text-black"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {format.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
