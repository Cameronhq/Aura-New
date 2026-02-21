import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura 灵气 - 你的AI情感军师",
  description:
    "Aura帮你看清关系真相，读懂情感信号，做出最聪明的恋爱决策。免费创建你的专属情感档案。",
  keywords: ["AI情感分析", "恋爱军师", "情感咨询", "关系分析"],
  openGraph: {
    title: "Aura 灵气 - 你的AI情感军师",
    description: "看清关系真相，读懂情感信号",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
