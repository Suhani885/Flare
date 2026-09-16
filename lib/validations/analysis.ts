import { z } from "zod";

const requiredString = z.string().min(1).max(200);

export const skinAnswersSchema = z.object({
  age: requiredString,
  skin_feel_after_washing: requiredString,
  shine_levels: requiredString,
  breakout_frequency: requiredString,
  skin_sensitivity: requiredString,
  climate_effect: requiredString,
  makeup_staying: requiredString,
  hydration_status: requiredString,
  pore_size: requiredString,
  main_concerns: requiredString,
});

export const hairAnswersSchema = z.object({
  age: requiredString,
  hair_texture: requiredString,
  scalp_condition: requiredString,
  wash_frequency: requiredString,
  hair_thickness: requiredString,
  chemical_treatments: requiredString,
  moisture_level: requiredString,
  hair_density: requiredString,
  scalp_sensitivity: requiredString,
  main_concerns: requiredString,
});

// Validates the LLM's JSON output before it's persisted/returned — JSON mode
// guarantees valid JSON, not that it matches our exact shape.
export const analysisResultSchema = z.object({
  primary_type: z.string().min(1),
  secondary_characteristics: z.array(z.string()).default([]),
  main_concerns: z.string().default(""),
  recommendations: z
    .object({
      routine: z.array(z.string()).default([]),
      ingredients: z.array(z.string()).default([]),
      avoid_ingredients: z.array(z.string()).default([]),
      lifestyle: z.array(z.string()).default([]),
      products: z
        .array(
          z.object({
            name: z.string(),
            category: z.string(),
            why: z.string(),
          })
        )
        .default([]),
    })
    .default({
      routine: [],
      ingredients: [],
      avoid_ingredients: [],
      lifestyle: [],
      products: [],
    }),
});
