import dynamic from "next/dynamic";
import { BottomNav } from "@/components/dashboard/BottomNav";

const GradientBackground = dynamic(
  () =>
    import("@/components/shared/GradientBackground").then(
      (mod) => mod.GradientBackground
    ),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20 relative">
      <GradientBackground variant="dashboard" />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
