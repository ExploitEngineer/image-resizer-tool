"use client";

import { useState } from "react";
import { ImageEditor } from "@/components/custom/ImageEditor";
import { FileUpload } from "@/components/aceternity/file-upload";
import { ModeToggle } from "@/components/theme/mode-toggle";

export default function Home() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const handleImageUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
      setImageName(file.name);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-white dark:bg-black text-black">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
          Image Resizer
        </h1>
        <div className="flex items-center gap-6">
          <ModeToggle />
          <a
            href="https://github.com/ExploitEngineer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition">
              GitHub ↗
            </button>
          </a>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center h-[calc(90vh-64px)] px-4 text-center">
        <h2 className="text-5xl md:text-7xl text-black dark:text-white font-extrabold mb-7">
          Upload & Resize Images
        </h2>
        {!imageURL ? (
          <div className="w-full max-w-md">
            <FileUpload onChange={handleImageUpload} />
          </div>
        ) : (
          <ImageEditor imageURL={imageURL} imageName={imageName} />
        )}
      </section>
    </main>
  );
}
