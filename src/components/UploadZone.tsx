"use client";

import { useRef, useState } from "react";

interface UploadZoneProps {
  onImagesSelected: (images: string[]) => void;
  images: string[];
  onClear: () => void;
}

export function UploadZone({ onImagesSelected, images, onClear }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const readers: Promise<string>[] = [];
    const max = Math.min(files.length, 4);
    for (let i = 0; i < max; i++) {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(files[i]);
        })
      );
    }
    Promise.all(readers).then((results) => {
      onImagesSelected([...images, ...results].slice(0, 4));
    });
  };

  if (images.length > 0) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F5F3]">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {images.length < 4 && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-[3/4] rounded-xl border-2 border-dashed border-[#DDD] flex flex-col items-center justify-center text-[#999] hover:border-[#999] transition-colors"
            >
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs">继续添加</span>
            </button>
          )}
        </div>
        <button
          onClick={() => { onClear(); }}
          className="text-xs text-[#999] underline underline-offset-2"
        >
          清除全部重新选择
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
        dragging ? "border-[#1A1A1A] bg-[#F5F5F3]" : "border-[#DDD] hover:border-[#999]"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
    >
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F3] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <p className="font-semibold text-[#1A1A1A] mb-1">上传聊天截图</p>
        <p className="text-sm text-[#999]">支持微信、iMessage、抖音等截图</p>
        <p className="text-xs text-[#BBB] mt-1">最多 4 张 · 点击或拖拽</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
