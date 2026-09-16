import type { AnalysisResult } from "@/types/analysis";

interface RawAnalysisResult {
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
}

export function mapAnalysisResult(raw: RawAnalysisResult): AnalysisResult {
  return {
    primaryType: raw.primary_type,
    secondaryType: raw.secondary_characteristics?.join(", ") ?? "",
    concerns: raw.main_concerns ? raw.main_concerns.split(", ") : [],
    recommendations: {
      routine: raw.recommendations?.routine ?? [],
      ingredients: raw.recommendations?.ingredients ?? [],
      avoidIngredients: raw.recommendations?.avoid_ingredients ?? [],
      lifestyleConsiderations: raw.recommendations?.lifestyle ?? [],
      products: raw.recommendations?.products ?? [],
    },
  };
}
