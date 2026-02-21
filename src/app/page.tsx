import dynamic from "next/dynamic";
import { HeroScreen } from "@/components/landing/HeroScreen";
import { DecoderScreen } from "@/components/landing/DecoderScreen";
import { MirrorScreen } from "@/components/landing/MirrorScreen";
import { PlannerScreen } from "@/components/landing/PlannerScreen";
import { FinalCTAScreen } from "@/components/landing/FinalCTAScreen";

const GradientBackground = dynamic(
  () =>
    import("@/components/shared/GradientBackground").then(
      (mod) => mod.GradientBackground
    ),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <main className="relative">
      <GradientBackground variant="landing" />
      <HeroScreen />
      <DecoderScreen />
      <MirrorScreen />
      <PlannerScreen />
      <FinalCTAScreen />
    </main>
  );
}
