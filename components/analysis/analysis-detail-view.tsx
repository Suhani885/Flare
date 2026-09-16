"use client";

import { useRouter } from "next/navigation";
import { ResultsStage } from "@/components/analysis/results-stage";
import type { AnalysisResult, AnalysisType } from "@/types/analysis";

export function AnalysisDetailView({
  result,
  type,
}: {
  result: AnalysisResult;
  type: AnalysisType;
}) {
  const router = useRouter();
  return <ResultsStage result={result} type={type} onReset={() => router.push("/dashboard")} />;
}
