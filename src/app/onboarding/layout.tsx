import dynamic from "next/dynamic";

const GradientBackground = dynamic(
  () =>
    import("@/components/shared/GradientBackground").then(
      (mod) => mod.GradientBackground
    ),
  { ssr: false }
);

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <GradientBackground variant="auth" />
      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
