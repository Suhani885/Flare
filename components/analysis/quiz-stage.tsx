"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { QuizStep, QuizFormData, AnalysisType } from "@/types/analysis";

interface QuizStageProps {
  steps: QuizStep[];
  currentStep: number;
  formData: QuizFormData;
  error: string | null;
  type: AnalysisType;
  submitting?: boolean;
  onSelect: (field: string, value: string) => void;
  onMultiSelect: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onBackToSelect: () => void;
}

export function QuizStage({
  steps,
  currentStep,
  formData,
  error,
  type,
  submitting = false,
  onSelect,
  onMultiSelect,
  onNext,
  onBack,
  onBackToSelect,
}: QuizStageProps) {
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const typeLabel = type === "skin" ? "Skin" : "Hair";

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] overflow-hidden px-4 py-20 pt-28 flex items-start justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-0 h-[400px] w-[400px] rounded-full bg-primary-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={currentStep === 0 ? onBackToSelect : onBack}
            className="flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-textPrimary"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 0 ? "Change type" : "Back"}
          </button>
          <span className="rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">
            {typeLabel} Analysis
          </span>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-textMuted">
            <span>Question {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-8 shadow-sm md:p-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">
            {step.title}
          </span>
          <h2 className="mt-2 font-serif text-2xl text-textPrimary mb-8 leading-snug md:text-3xl">
            {step.question}
          </h2>

          {step.multiSelect ? (
            <div className="space-y-3">
              <p className="text-xs text-textMuted mb-2">
                {(formData[step.field] as string[]).length}/3 selected
              </p>
              {step.options.map((option) => {
                const selected = (formData[step.field] as string[]).includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => onMultiSelect(step.field, option.value)}
                    className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      selected
                        ? "border-primary-500 bg-primary-50"
                        : "border-border bg-surface hover:border-primary-200 hover:bg-primary-50/30"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                        selected ? "border-primary-500 bg-primary-500" : "border-border"
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${selected ? "text-primary-700" : "text-textPrimary"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {step.options.map((option) => {
                const selected = formData[step.field] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => onSelect(step.field, option.value)}
                    className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      selected
                        ? "border-primary-500 bg-primary-50"
                        : "border-border bg-surface hover:border-primary-200 hover:bg-primary-50/30"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        selected ? "border-primary-500" : "border-border"
                      }`}
                    >
                      {selected && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                    </div>
                    <span className={`text-sm font-medium ${selected ? "text-primary-700" : "text-textPrimary"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>}

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={currentStep === 0 ? onBackToSelect : onBack}
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-textSecondary transition-all hover:bg-surface"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={onNext}
              disabled={submitting}
              className="group flex items-center gap-2 rounded-xl bg-textPrimary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {currentStep === steps.length - 1
                ? submitting
                  ? "Analyzing..."
                  : "Get My Results"
                : "Next"}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentStep
                  ? "h-2 w-6 bg-primary-500"
                  : i === currentStep
                  ? "h-2 w-8 bg-primary-600"
                  : "h-2 w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
