"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, Send, X, CalendarHeart, Gift, AlertCircle, Camera } from "lucide-react";
import { MagicMenu } from "./MagicMenu";

interface InputBarProps {
  onSend: (text: string, images?: string[]) => void;
  onMenuSelect: (id: string) => void;
}

async function resizeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_WIDTH = 1200;
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

export function InputBar({ onSend, onMenuSelect }: InputBarProps) {
  const [text, setText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFiles = async (files: FileList) => {
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await resizeImageToBase64(file);
        newImages.push(dataUrl);
      } catch {
        // skip failed files
      }
    }
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const haptic = (ms = 40) => {
    try { navigator.vibrate?.(ms); } catch { /* not supported */ }
  };

  const handleSend = () => {
    if (!text.trim() && selectedImages.length === 0) return;
    haptic();
    if (selectedImages.length > 0) {
      onSend(text.trim(), selectedImages);
    } else {
      onSend(text.trim());
    }
    setText("");
    setSelectedImages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 || selectedImages.length > 0;

  const quickChips = [
    { id: "screenshot", label: "截图分析", icon: Camera, color: "text-aurora-mid" },
    { id: "date", label: "约会方案", icon: CalendarHeart, color: "text-glow-cyan" },
    { id: "gift", label: "礼物推荐", icon: Gift, color: "text-glow-amber" },
    { id: "sos", label: "紧急回复", icon: AlertCircle, color: "text-glow-pink" },
  ] as const;

  const handleChip = (id: string) => {
    if (id === "screenshot") {
      fileInputRef.current?.click();
    } else {
      onMenuSelect(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-void/90 backdrop-blur-xl">
      {/* Quick action chips */}
      <div className="max-w-lg mx-auto px-3 pt-2.5 pb-1">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {quickChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => handleChip(chip.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary hover:bg-white/10 transition-colors shrink-0 whitespace-nowrap"
              >
                <Icon className={`w-3 h-3 ${chip.color}`} />
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image preview strip */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <motion.div
            className="max-w-lg mx-auto px-3 pt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {selectedImages.map((img, i) => (
                <div key={i} className="relative shrink-0">
                  <img
                    src={img}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg border border-white/10"
                  />
                  <button
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-void border border-white/20 flex items-center justify-center"
                    onClick={() => removeImage(i)}
                  >
                    <X className="w-2.5 h-2.5 text-text-secondary" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto flex items-end gap-2 px-3 py-3 pb-safe">
        {/* Magic menu */}
        <MagicMenu onSelect={onMenuSelect} />

        {/* Text input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImages.length > 0 ? "添加备注（可选）..." : "向军师提问..."}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-aurora-mid/50 transition-colors"
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleImageFiles(e.target.files)}
        />

        {/* Image upload button */}
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
            selectedImages.length > 0
              ? "bg-aurora-start/20 border border-aurora-start/40"
              : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon
            className={`w-5 h-5 ${selectedImages.length > 0 ? "text-aurora-mid" : "text-text-tertiary"}`}
          />
        </button>

        {/* Send button */}
        {canSend && (
          <motion.button
            className="w-10 h-10 rounded-full bg-aurora-start flex items-center justify-center shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
