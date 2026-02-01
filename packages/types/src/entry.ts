import { z } from "zod";
import { MoodSchema } from "./mood";

/**
 * TipTap content types for rich text editor
 */
export interface TipTapNode {
	type: string;
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

export interface TipTapDoc {
	type: "doc";
	content: TipTapNode[];
}

/**
 * Entry model with full fields matching database schema
 * Used across database, API, and UI layers
 */
export interface Entry {
	id: string;
	userId: string;
	date: string; // ISO date string
	title: string | null;
	content: TipTapDoc;
	moods: string[];
	dominantMood: string | null;
	isBragWorthy: boolean;
	aiFeedback: string | null;
	aiSuggestedBullets: string[] | null;
	aiBragWorthySuggestion: {
		suggested: boolean;
		reasoning: string;
		confidence: "high" | "medium" | "low";
	} | null;
	aiAnalyzedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Input type for creating a new entry
 */
export interface CreateEntryInput {
	title?: string;
	content: TipTapDoc;
	date: string;
}

/**
 * Input type for updating an existing entry
 */
export interface UpdateEntryInput {
	id: string;
	title?: string;
	content?: TipTapDoc;
	date?: string;
}

/**
 * Input type for listing entries with filters
 */
export interface ListEntriesInput {
	startDate?: string;
	endDate?: string;
	mood?: string;
	bragWorthy?: boolean;
	limit: number;
	offset: number;
}

/**
 * Input type for getting a single entry
 */
export interface GetEntryInput {
	id: string;
}

/**
 * Input type for toggling brag-worthy flag
 */
export interface ToggleBragWorthyInput {
	id: string;
	isBragWorthy: boolean;
}

/**
 * Input type for deleting an entry
 */
export interface DeleteEntryInput {
	id: string;
}

// Zod schema for TipTap content (recursive)
export const TipTapNodeSchema: z.ZodSchema<TipTapNode> = z.object({
	type: z.string(),
	attrs: z.record(z.string(), z.unknown()).optional(),
	content: z.array(z.lazy(() => TipTapNodeSchema)).optional(),
});

export const TipTapDocSchema = z.object({
	type: z.literal("doc"),
	content: z.array(TipTapNodeSchema),
});

// Zod schemas for API validation
export const EntrySchema = z.object({
	id: z.string().uuid(),
	userId: z.string(),
	date: z.string().datetime(),
	title: z.string().max(255).nullable(),
	content: TipTapDocSchema,
	moods: z.array(MoodSchema),
	dominantMood: MoodSchema.nullable(),
	isBragWorthy: z.boolean().default(false),
	aiFeedback: z.string().nullable(),
	aiSuggestedBullets: z.array(z.string()).nullable(),
	aiBragWorthySuggestion: z
		.object({
			suggested: z.boolean(),
			reasoning: z.string(),
			confidence: z.enum(["high", "medium", "low"]),
		})
		.nullable(),
	aiAnalyzedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateEntryInputSchema = z.object({
	title: z.string().max(255).optional(),
	content: TipTapDocSchema,
	date: z.string().datetime(),
});

export const UpdateEntryInputSchema = z.object({
	id: z.string().uuid(),
	title: z.string().max(255).optional(),
	content: TipTapDocSchema.optional(),
	date: z.string().datetime().optional(),
});

export const ListEntriesInputSchema = z.object({
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional(),
	mood: MoodSchema.optional(),
	bragWorthy: z.boolean().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export const GetEntryInputSchema = z.object({
	id: z.string().uuid(),
});

export const ToggleBragWorthyInputSchema = z.object({
	id: z.string().uuid(),
	isBragWorthy: z.boolean(),
});

export const DeleteEntryInputSchema = z.object({
	id: z.string().uuid(),
});
