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
import { GraduationCap, ArrowRight, Home } from "lucide-react";

// List of popular universities
const UNIVERSITIES = [
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "University of Oxford",
  "University of Cambridge",
  "California Institute of Technology",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of Chicago",
  "Other",
];

export default function UniversityStep() {
  const { onboardingData, updateOnboardingData, nextStep } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();

  const [university, setUniversity] = useState(onboardingData.university || "");
  const [otherUniversity, setOtherUniversity] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!university) {
      setError(t("errors.required") || "This field is required");
      return;
    }

    const finalUniversity = university === "Other" ? otherUniversity : university;

    if (university === "Other" && !otherUniversity) {
      setError(t("errors.required") || "This field is required");
      return;
    }

    updateOnboardingData({ university: finalUniversity });
    nextStep();
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
          <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground px-2">
          {t("onboarding.university.title") || "What's your university?"}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto px-4">
          {t("onboarding.university.subtitle") ||
            "Help us personalize your learning experience"}
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
          <Label htmlFor="university" className="text-sm font-medium">
            {t("onboarding.university.select") || "Select your university"}
          </Label>
          <Select
            value={university}
            onValueChange={(value) => {
              setUniversity(value);
              setError("");
            }}
          >
            <SelectTrigger className="h-12">
              <SelectValue
                placeholder={
                  t("onboarding.university.placeholder") ||
                  "Choose your university"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {UNIVERSITIES.map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {university === "Other" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <Label htmlFor="otherUniversity" className="text-sm font-medium">
              {t("onboarding.university.other") || "Enter your university"}
            </Label>
            <Input
              id="otherUniversity"
              type="text"
              placeholder={
                t("onboarding.university.otherPlaceholder") ||
                "Type your university name"
              }
              value={otherUniversity}
              onChange={(e) => {
                setOtherUniversity(e.target.value);
                setError("");
              }}
              className="h-12"
            />
          </motion.div>
        )}

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
            onClick={() => router.push("/")}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 mr-2" />
            {t("onboarding.buttons.skip") || "Skip for now"}
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
            disabled={!university || (university === "Other" && !otherUniversity)}
          >
            {t("onboarding.buttons.next") || "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
