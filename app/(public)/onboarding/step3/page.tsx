"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/OnboardingContext";
import { useLanguage } from "@/lib/LanguageContext";
import OnboardingProgress from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, ArrowLeft } from "lucide-react";

// Available degree options
const DEGREES = [
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" }, 
  { value: "phd", label: "PhD / Doctorate" },
];

export default function DegreeStep() {
  const { onboardingData, updateOnboardingData, nextStep, prevStep } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();

  const [degree, setDegree] = useState(onboardingData.degree || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!degree) {
      setError(t("errors.required") || "This field is required");
      return;
    }

    updateOnboardingData({ degree });
    nextStep();
    router.push("/onboarding/step4");
  };

  const handleBack = () => {
    prevStep();
    router.push("/onboarding/step2");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8"
    >
      <OnboardingProgress />

      {/* Header Section */}
      <div className="text-center space-y-2 sm:space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4"
        >
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground px-2">
          {t("onboarding.degree.title") || "What's your degree?"}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto px-4">
          {t("onboarding.degree.subtitle") ||
            "Tell us about your educational background"}
        </p>
      </div>

      {/* Form Section */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-3">
          <Label htmlFor="degree" className="text-sm font-medium">
            {t("onboarding.degree.select") || "Select your degree"}
          </Label>
          <Select
            value={degree}
            onValueChange={(value) => {
              setDegree(value);
              setError("");
            }}
          >
            <SelectTrigger className="h-12">
              <SelectValue
                placeholder={
                  t("onboarding.degree.placeholder") ||
                  "Choose your degree"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {DEGREES.map((deg) => (
                <SelectItem key={deg.value} value={deg.value}>
                  {deg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("onboarding.buttons.back") || "Back"}
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
            disabled={!degree}
          >
            {t("onboarding.buttons.next") || "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
