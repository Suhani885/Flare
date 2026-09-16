import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Free tier gets a smaller/faster model; Premium gets the larger model with a
// richer prompt (see lib/analysis-prompts.ts) — genuine quality difference,
// not just longer output.
export const GROQ_MODEL_FREE = "openai/gpt-oss-20b";
export const GROQ_MODEL_PREMIUM = "openai/gpt-oss-120b";
