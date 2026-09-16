"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizStage } from "@/components/analysis/quiz-stage";
import { ResultsStage } from "@/components/analysis/results-stage";
import { hairSteps, initialHairData } from "@/data/hair-questions";
import { apiCall } from "@/lib/api";
import { endpoints } from "@/constants/urls";
import { mapAnalysisResult } from "@/lib/analysis-mapper";
import type { QuizFormData, AnalysisResult, AnalysisStage } from "@/types/analysis";

function getHairLabel(steps: typeof hairSteps, data: QuizFormData, field: string) {
  const step = steps.find((s) => s.field === field);
  if (!step) return data[field] as string;
  const opt = step.options.find((o) => o.value === (data[field] as string));
  return opt ? opt.label : (data[field] as string);
}

function formatHairPayload(data: QuizFormData) {
  const concerns = (data.mainConcerns as string[]).map((v) => {
    const step = hairSteps.find((s) => s.field === "mainConcerns")!;
    return step.options.find((o) => o.value === v)?.label ?? v;
  });
  return {
    age: getHairLabel(hairSteps, data, "age"),
    hair_texture: getHairLabel(hairSteps, data, "hairTexture"),
    scalp_condition: getHairLabel(hairSteps, data, "scalpCondition"),
    wash_frequency: getHairLabel(hairSteps, data, "washFrequency"),
    hair_thickness: getHairLabel(hairSteps, data, "hairThickness"),
    chemical_treatments: getHairLabel(hairSteps, data, "chemicalTreatments"),
    moisture_level: getHairLabel(hairSteps, data, "moistureLevel"),
    hair_density: getHairLabel(hairSteps, data, "hairDensity"),
    scalp_sensitivity: getHairLabel(hairSteps, data, "scalpSensitivity"),
    main_concerns: concerns.join(", "),
  };
}

export default function HairAnalysisPage() {
  const router = useRouter();
  const [stage, setStage] = useState<AnalysisStage>("quiz");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuizFormData>(initialHairData);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleMultiSelect = (field: string, value: string) => {
    setFormData((prev) => {
      const current = (prev[field] as string[]) || [];
      if (current.includes(value))
        return { ...prev, [field]: current.filter((v) => v !== value) };
      if (current.length < 3)
        return { ...prev, [field]: [...current, value] };
      return prev;
    });
  };

  const handleNext = () => {
    const step = hairSteps[currentStep];
    const val = formData[step.field];
    if (step.multiSelect) {
      if ((val as string[]).length === 0) {
        setError("Please select at least one option.");
        return;
      }
    } else if (!val) {
      setError("Please select an option before continuing.");
      return;
    }
    setError(null);
    if (currentStep < hairSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const payload = formatHairPayload(formData);
    const response = await apiCall<{
      primary_type: string;
      secondary_characteristics?: string[];
      main_concerns?: string;
      recommendations?: {
        routine?: string[];
        ingredients?: string[];
        avoid_ingredients?: string[];
        lifestyle?: string[];
        products?: { name: string; category: string; why: string }[];
      };
    }>("POST", endpoints.HAIR_ANALYSIS, { data: payload });

    setSubmitting(false);

    if (response.status === 401) {
      router.push("/login?callbackUrl=/analysis/hair");
      return;
    }

    if (!response.success || !response.data) {
      setError(response.message ?? "Something went wrong. Please try again.");
      return;
    }

    setResult(mapAnalysisResult(response.data));
    setStage("results");
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData(initialHairData);
    setResult(null);
    setError(null);
    setStage("quiz");
  };

  if (stage === "results" && result) {
    return <ResultsStage result={result} type="hair" onReset={handleReset} />;
  }

  return (
    <QuizStage
      steps={hairSteps}
      currentStep={currentStep}
      formData={formData}
      error={error}
      type="hair"
      submitting={submitting}
      onSelect={handleSelect}
      onMultiSelect={handleMultiSelect}
      onNext={handleNext}
      onBack={handleBack}
      onBackToSelect={() => router.push("/analysis")}
    />
  );
}
