"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/OnboardingContext";
import { useLanguage } from "@/lib/LanguageContext";
import OnboardingProgress from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

// List of common academic interests
const INTERESTS = [
  "Mathematics",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business",
  "Economics",
  "Psychology",
  "Sociology",
  "Literature",
  "History",
  "Philosophy",
  "Art",
  "Music",
  "Medicine",
  "Law",
  "Political Science",
  "Environmental Science",
  "Languages",
];

export default function InterestsStep() {
  const { onboardingData, updateOnboardingData, prevStep, submitOnboardingAnswers } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();

  const [selectedInterests, setSelectedInterests] = useState<string[]>(onboardingData.interests || []);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedInterests.length === 0) {
      setError(t("onboarding.interests.required") || "Please select at least one interest");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Update local data first
      updateOnboardingData({
        interests: selectedInterests,
        completed: true,
        currentStep: 5,
      });

      // Submit to backend
      await submitOnboardingAnswers();

      // Redirect to dashboard after successful submission
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit onboarding:", error);
      setError("Failed to save your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    prevStep();
    router.push("/onboarding/step4");
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
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground px-2">
          {t("onboarding.interests.title") || "What interests you?"}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto px-4">
          {t("onboarding.interests.subtitle") ||
            "Choose your academic interests to get personalized recommendations"}
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {t("onboarding.interests.select") || "Select your interests"}
            </Label>
            <Badge variant="secondary" className="text-xs">
              {selectedInterests.length} selected
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("onboarding.interests.selectMultiple") || "You can select multiple interests"}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
          >
            {INTERESTS.map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                onClick={() => toggleInterest(interest)}
                className={`
                  cursor-pointer p-2 sm:p-3 border-2 rounded-lg text-xs sm:text-sm text-center transition-all duration-200 hover:scale-105
                  ${
                    selectedInterests.includes(interest)
                      ? "bg-primary/10 border-primary text-primary font-medium shadow-md"
                      : "bg-card border-border text-foreground hover:bg-accent hover:border-accent-foreground"
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-1">
                  {selectedInterests.includes(interest) && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  <span className="text-xs sm:text-sm leading-tight">{interest}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            disabled={selectedInterests.length === 0 || isSubmitting}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : (t("onboarding.buttons.finish") || "Complete Setup")}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
