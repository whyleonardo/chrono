import { z } from "zod";
import type { Mood } from "./mood";
import { MoodSchema } from "./mood";

/**
 * Entry model for work journal entries
 * Used across database, API, and UI layers
 */
export interface Entry {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	dominantMood: Mood;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Input type for creating a new entry
 */
export interface CreateEntryInput {
	title: string;
	description?: string | null;
	dominantMood: Mood;
}

/**
 * Input type for updating an existing entry
 */
export interface UpdateEntryInput {
	title?: string;
	description?: string | null;
	dominantMood?: Mood;
}

// Zod schemas for validation
export const EntrySchema = z.object({
	id: z.string(),
	userId: z.string(),
	title: z.string().min(1).max(255),
	description: z.string().nullable(),
	dominantMood: MoodSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateEntryInputSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().optional().nullable(),
	dominantMood: MoodSchema,
});

export const UpdateEntryInputSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().optional().nullable(),
	dominantMood: MoodSchema.optional(),
});
