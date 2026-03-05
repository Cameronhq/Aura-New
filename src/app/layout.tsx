import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "感情军师 - AI 好感度分析",
  description: "上传聊天截图，AI帮你分析TA的真实态度，给出好感度评分和恋爱建议。",
  keywords: ["感情分析", "好感度", "恋爱建议", "AI", "聊天记录分析"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAFAF8",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased bg-[#FAFAF8] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
