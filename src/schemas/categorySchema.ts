
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface CategoryData {
  id?: string;
  name: string;
  description?: string;
  thumbnail?: string;
}

export const posterSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  category: z.string().optional(),
  description: z.string().optional(),
  serviceUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

export type PosterFormValues = z.infer<typeof posterSchema>;
