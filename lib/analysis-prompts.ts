type AnalysisKind = "skin" | "hair";

const RESPONSE_SHAPE = `{
  "primary_type": string,               // e.g. "Combination Skin" or "Wavy, Medium-Density Hair"
  "secondary_characteristics": string[], // 1-3 short descriptive traits
  "main_concerns": string,               // comma-separated, echoing the user's stated concerns in clinical language
  "recommendations": {
    "routine": string[],                 // ordered step-by-step routine, each step one short sentence
    "ingredients": string[],             // ingredients/actives to seek out, each with a 3-6 word reason in parentheses
    "avoid_ingredients": string[],       // ingredients/practices to avoid, each with a short reason in parentheses
    "lifestyle": string[],               // lifestyle/environmental tips
    "products": [                        // budget-aware generic product ideas (no real brand names/prices)
      { "name": string, "category": string, "why": string }
    ]
  }
}`;

const DEPTH_INSTRUCTIONS: Record<"FREE" | "PREMIUM", string> = {
  FREE: `Keep it concise: 3-4 routine steps, 3-4 ingredients to seek, 2-3 to avoid, 2 lifestyle tips, 2 product ideas. Give solid general guidance without excessive specificity.`,
  PREMIUM: `Go in depth: 5-7 routine steps (specify AM/PM where relevant), 5-7 ingredients to seek with the specific benefit and how it addresses their stated concerns, 4-5 to avoid with clear reasoning, 4-5 lifestyle/environmental tips, 4-5 product ideas spanning a full routine (cleanser, treatment, moisturizer, protection, etc.) with budget variety implied in the "why" field. Be specific and personalized to the exact answers given, not generic.`,
};

function formatAnswers(answers: Record<string, string>): string {
  return Object.entries(answers)
    .map(([key, value]) => `- ${key.replace(/_/g, " ")}: ${value}`)
    .join("\n");
}

export function buildAnalysisPrompt(
  kind: AnalysisKind,
  answers: Record<string, string>,
  tier: "FREE" | "PREMIUM"
): { system: string; user: string } {
  const domain =
    kind === "skin"
      ? "a licensed esthetician and cosmetic chemist specializing in evidence-based skincare"
      : "a trichologist and cosmetic chemist specializing in evidence-based haircare";

  const system = `You are ${domain}, writing for a beauty platform used by people of every gender identity — never assume the user is a woman, and never use gendered language.

Analyze the quiz answers and respond with ONLY a single valid JSON object (no markdown, no code fences, no commentary before or after) matching exactly this shape:
${RESPONSE_SHAPE}

${DEPTH_INSTRUCTIONS[tier]}

Ground every recommendation in the specific answers given — do not give generic advice that ignores their stated ${kind} type, sensitivity, and concerns. Never recommend seeing a doctor/dermatologist as a cop-out; give real actionable guidance, but do add a brief lifestyle note to consult a professional only if answers suggest a possible medical condition (e.g. severe/persistent issues).`;

  const user = `Quiz answers:\n${formatAnswers(answers)}\n\nReturn the JSON object now.`;

  return { system, user };
}
