import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(120),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  // Rupees, as entered by the seller — converted to paise before storage.
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(2).max(60),
  audience: z.enum(["WOMEN", "MEN", "UNISEX"]).default("UNISEX"),
  images: z.array(z.string().url()).min(1, "Add at least one image").max(6),
  ingredients: z.array(z.string().min(1)).max(30).default([]),
  benefits: z.array(z.string().min(1)).max(20).default([]),
  stock: z.number().int().min(0).default(0),
  sustainabilityScore: z.number().int().min(0).max(100).nullable().optional(),
  // Admin-only fields for the bootstrap external catalog.
  isExternal: z.boolean().default(false),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  sourceName: z.string().max(80).optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;

export const productStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
