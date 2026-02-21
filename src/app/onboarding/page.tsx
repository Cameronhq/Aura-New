"use client";

import { useOnboardingStore } from "@/stores/onboardingStore";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { IdentityStep } from "@/components/onboarding/IdentityStep";
import { OrientationStep } from "@/components/onboarding/OrientationStep";
import { StatusStep } from "@/components/onboarding/StatusStep";
import { VibeStep } from "@/components/onboarding/VibeStep";

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore();

  const steps: Record<number, React.ReactNode> = {
    1: <IdentityStep />,
    2: <OrientationStep />,
    3: <StatusStep />,
    4: <VibeStep />,
  };

  return (
    <>
      <OnboardingProgress currentStep={currentStep} totalSteps={4} />
      {steps[currentStep]}
    </>
  );
}
