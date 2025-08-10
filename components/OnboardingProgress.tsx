"use client";

import React from "react";
import { useOnboarding } from "@/lib/OnboardingContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

export default function OnboardingProgress() {
  const { onboardingData } = useOnboarding();
  const { t } = useLanguage();

  const totalSteps = 5;
  const currentStep = onboardingData.currentStep;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, label: t("onboarding.steps.university") || "University" },
    { number: 2, label: t("onboarding.steps.age") || "Age" },
    { number: 3, label: t("onboarding.steps.degree") || "Degree" },
    { number: 4, label: t("onboarding.steps.graduation") || "Graduation" },
    { number: 5, label: t("onboarding.steps.interests") || "Interests" },
  ];

  return (
    <div className="mb-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            {t("onboarding.step") || "Step"} {currentStep}{" "}
            {t("onboarding.of") || "of"} {totalSteps}
          </h3>
          <p className="text-xs text-muted-foreground">
            {steps[currentStep - 1]?.label}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-primary">
            {Math.round(progressPercentage)}%
          </span>
          <p className="text-xs text-muted-foreground">
            {t("onboarding.complete") || "Complete"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-muted"
        />
      </div>

      {/* Step Indicators - Mobile Responsive */}
      <div className="flex justify-between items-center gap-1 sm:gap-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center flex-1 min-w-0"
          >
            <div
              className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 ${
                step.number < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.number === currentStep
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : step.number === currentStep ? (
                <Circle className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              ) : (
                <span className="text-xs font-medium">{step.number}</span>
              )}
            </div>
            <span
              className={`text-xs mt-1 sm:mt-2 text-center leading-tight truncate w-full ${
                step.number <= currentStep
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
