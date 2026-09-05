"use client";
import { useState } from "react";
import StepIdentity from "./steps/StepIdentify";
import StepBranding from "./steps/StepBranding";
import StepTheme from "./steps/StepTheme";
import StepDelivery from "./steps/StepDelivery";
import StepReview from "./steps/StepReview";
import { OnboardingData } from "./types";

const steps = [StepIdentity, StepBranding, StepTheme, StepDelivery, StepReview];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    governorates: [],
  });

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const StepComponent = steps[currentStep];

  return (
    <div>
      <p>Step {currentStep + 1} of {steps.length}</p>
      <StepComponent
        data={data}
        updateData={updateData}
        onNext={next}
        onBack={back}
      />
    </div>
  );
};
export default OnboardingPage;