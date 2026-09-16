import { groq, GROQ_MODEL_FREE, GROQ_MODEL_PREMIUM } from "@/lib/groq";
import { buildAnalysisPrompt } from "@/lib/analysis-prompts";
import { analysisResultSchema } from "@/lib/validations/analysis";
import { prisma } from "@/lib/prisma";
import type { Tier, AnalysisType } from "@/lib/generated/prisma/enums";

export class AnalysisGenerationError extends Error {}

export async function runAnalysis({
  kind,
  answers,
  userId,
  tier,
}: {
  kind: "skin" | "hair";
  answers: Record<string, string>;
  userId: string;
  tier: Tier;
}) {
  const { system, user } = buildAnalysisPrompt(kind, answers, tier);
  const model = tier === "PREMIUM" ? GROQ_MODEL_PREMIUM : GROQ_MODEL_FREE;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      // gpt-oss models are reasoning models — their "thinking" tokens count
      // against max_tokens, so budgets need real headroom beyond the visible
      // JSON. reasoning_effort trades thinking depth for token usage.
      reasoning_effort: tier === "PREMIUM" ? "medium" : "low",
      reasoning_format: "hidden",
      max_tokens: tier === "PREMIUM" ? 4000 : 2000,
    });
  } catch (error) {
    console.error("Groq API error:", error);
    throw new AnalysisGenerationError("The AI service is temporarily unavailable. Please try again.");
  }

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new AnalysisGenerationError("The AI didn't return a response. Please try again.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AnalysisGenerationError("The AI returned an unreadable response. Please try again.");
  }

  const result = analysisResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new AnalysisGenerationError("The AI response didn't match the expected format. Please try again.");
  }

  await prisma.analysis.create({
    data: {
      userId,
      type: kind.toUpperCase() as AnalysisType,
      answers,
      resultJson: result.data,
      tierUsed: tier,
    },
  });

  return result.data;
}
