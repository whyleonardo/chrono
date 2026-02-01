import { db, entries } from "@chrono/db";
import type { Entry } from "@chrono/types/entry";
import {
	CreateEntryInputSchema,
	DeleteEntryInputSchema,
	GetEntryInputSchema,
	ListEntriesInputSchema,
	ToggleBragWorthyInputSchema,
	UpdateEntryInputSchema,
} from "@chrono/types/entry";
import { ORPCError } from "@orpc/server";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { protectedProcedure } from "../procedures";
import {
	calculateDominantMood,
	extractMoodsFromContent,
} from "../utils/mood-extractor";

/**
 * Create a new entry with automatic mood extraction
 * POST /entries
 */
export const createEntry = protectedProcedure
	.input(CreateEntryInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { title, content, date } = input;
		const userId = context.session.user.id;

		// Extract moods from content
		const extractedMoods = extractMoodsFromContent(content);
		const dominantMood = calculateDominantMood(extractedMoods);

		// Extract date part only (PostgreSQL date type expects YYYY-MM-DD)
		const dateObj = new Date(date);
		const dateString = dateObj.toISOString().split("T")[0];

		if (!dateString) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Invalid date provided",
				status: 400,
			});
		}

		const [entry] = await db
			.insert(entries)
			.values({
				userId,
				title: title === undefined ? null : title,
				content,
				moods: extractedMoods,
				dominantMood,
				date: dateString,
				isBragWorthy: false,
			})
			.returning();

		if (!entry) {
			throw new ORPCError("INTERNAL_ERROR", {
				message: "Failed to create entry",
				status: 500,
			});
		}

		return entry as Entry;
	});

/**
 * List entries with filtering and pagination
 * GET /entries?startDate=&endDate=&mood=&bragWorthy=&limit=&offset=
 */
export const listEntries = protectedProcedure
	.input(ListEntriesInputSchema)
	.handler(async ({ input, context }): Promise<Entry[]> => {
		const { startDate, endDate, mood, bragWorthy, limit, offset } = input;
		const userId = context.session.user.id;

		// Build where conditions dynamically
		const conditions = [eq(entries.userId, userId)];

		if (startDate) {
			const startDateString = new Date(startDate).toISOString().split("T")[0];
			if (startDateString) {
				conditions.push(gte(entries.date, startDateString));
			}
		}

		if (endDate) {
			const endDateString = new Date(endDate).toISOString().split("T")[0];
			if (endDateString) {
				conditions.push(lte(entries.date, endDateString));
			}
		}

		if (mood) {
			// Use GIN index for array contains
			conditions.push(sql`${entries.moods} @> ARRAY[${mood}]::mood[]`);
		}

		if (bragWorthy !== undefined) {
			conditions.push(eq(entries.isBragWorthy, bragWorthy));
		}

		const results = await db
			.select({
				id: entries.id,
				userId: entries.userId,
				date: entries.date,
				title: entries.title,
				content: entries.content,
				moods: entries.moods,
				dominantMood: entries.dominantMood,
				isBragWorthy: entries.isBragWorthy,
				aiFeedback: entries.aiFeedback,
				aiSuggestedBullets: entries.aiSuggestedBullets,
				aiBragWorthySuggestion: entries.aiBragWorthySuggestion,
				aiAnalyzedAt: entries.aiAnalyzedAt,
				createdAt: entries.createdAt,
				updatedAt: entries.updatedAt,
			})
			.from(entries)
			.where(and(...conditions))
			.orderBy(desc(entries.date))
			.limit(limit)
			.offset(offset);

		return results as Entry[];
	});

/**
 * Get a single entry by ID
 * GET /entries/:id
 */
export const getEntry = protectedProcedure
	.input(GetEntryInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { id } = input;
		const userId = context.session.user.id;

		const entry = await db.query.entries.findFirst({
			where: and(eq(entries.id, id), eq(entries.userId, userId)),
		});

		if (!entry) {
			throw new ORPCError("NOT_FOUND", {
				message: "Entry not found",
				status: 404,
			});
		}

		return entry as Entry;
	});

/**
 * Update an entry
 * PUT /entries/:id
 */
export const updateEntry = protectedProcedure
	.input(UpdateEntryInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { id, ...updates } = input;
		const userId = context.session.user.id;

		// Re-extract moods if content changed
		const updateData: Record<string, unknown> = {};

		if (updates.title !== undefined) {
			updateData.title = updates.title;
		}

		if (updates.content) {
			const extractedMoods = extractMoodsFromContent(updates.content);
			const dominantMood = calculateDominantMood(extractedMoods);
			updateData.content = updates.content;
			updateData.moods = extractedMoods;
			updateData.dominantMood = dominantMood;
		}

		if (updates.date) {
			updateData.date = new Date(updates.date).toISOString().split("T")[0];
		}

		// Prevent empty updates
		if (Object.keys(updateData).length === 0) {
			throw new ORPCError("BAD_REQUEST", {
				message: "No fields provided for update",
				status: 400,
			});
		}

		const [entry] = await db
			.update(entries)
			.set({
				...updateData,
				updatedAt: new Date(),
			})
			.where(and(eq(entries.id, id), eq(entries.userId, userId)))
			.returning();

		if (!entry) {
			throw new ORPCError("NOT_FOUND", {
				message: "Entry not found",
				status: 404,
			});
		}

		return entry as Entry;
	});

/**
 * Delete an entry
 * DELETE /entries/:id
 */
export const deleteEntry = protectedProcedure
	.input(DeleteEntryInputSchema)
	.handler(async ({ input, context }): Promise<{ success: boolean }> => {
		const { id } = input;
		const userId = context.session.user.id;

		const result = await db
			.delete(entries)
			.where(and(eq(entries.id, id), eq(entries.userId, userId)))
			.returning();

		if (result.length === 0) {
			throw new ORPCError("NOT_FOUND", {
				message: "Entry not found",
				status: 404,
			});
		}

		return { success: true };
	});

/**
 * Toggle brag-worthy flag on an entry
 * PATCH /entries/:id/flag
 */
export const toggleBragWorthy = protectedProcedure
	.input(ToggleBragWorthyInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { id, isBragWorthy } = input;
		const userId = context.session.user.id;

		const [entry] = await db
			.update(entries)
			.set({ isBragWorthy })
			.where(and(eq(entries.id, id), eq(entries.userId, userId)))
			.returning();

		if (!entry) {
			throw new ORPCError("NOT_FOUND", {
				message: "Entry not found",
				status: 404,
			});
		}

		return entry as Entry;
	});
