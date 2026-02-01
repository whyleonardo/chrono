import {
	createEntry as createEntryQuery,
	deleteEntry as deleteEntryQuery,
	getEntryById,
	listEntries as listEntriesQuery,
	toggleBragWorthy as toggleBragWorthyQuery,
	updateEntry as updateEntryQuery,
} from "@chrono/db/queries/entries";
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
	.route({
		method: "POST",
		path: "/entries",
		summary: "Create Entry",
		description:
			"Create a new career journal entry with automatic mood extraction from TipTap content. Extracted moods are stored and used for heatmap visualization.",
	})
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

		const entry = await createEntryQuery({
			userId,
			date: dateString,
			title,
			content,
			moods: extractedMoods,
			dominantMood,
			isBragWorthy: false,
		});

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
 * GET /entries
 */
export const listEntries = protectedProcedure
	.route({
		method: "GET",
		path: "/entries",
		summary: "List Entries",
		description:
			"List career journal entries with optional filtering by date range, mood, and brag-worthy status. Supports pagination with limit and offset parameters.",
	})
	.input(ListEntriesInputSchema)
	.handler(async ({ input, context }): Promise<Entry[]> => {
		const { startDate, endDate, mood, bragWorthy, limit, offset } = input;
		const userId = context.session.user.id;

		// Format date strings for query
		const formattedStartDate = startDate
			? new Date(startDate).toISOString().split("T")[0]
			: undefined;
		const formattedEndDate = endDate
			? new Date(endDate).toISOString().split("T")[0]
			: undefined;

		const results = await listEntriesQuery(
			userId,
			{
				startDate: formattedStartDate,
				endDate: formattedEndDate,
				mood: mood as
					| "flow"
					| "buggy"
					| "learning"
					| "meetings"
					| "standard"
					| undefined,
				bragWorthy,
			},
			{ limit, offset }
		);

		return results as Entry[];
	});

/**
 * Get a single entry by ID
 * GET /entries/:id
 */
export const getEntry = protectedProcedure
	.route({
		method: "GET",
		path: "/entries/{id}",
		summary: "Get Entry",
		description:
			"Retrieve a single career journal entry by its ID. Returns 404 if the entry doesn't exist or belongs to another user.",
	})
	.input(GetEntryInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { id } = input;
		const userId = context.session.user.id;

		const entry = await getEntryById(id, userId);

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
	.route({
		method: "PUT",
		path: "/entries/{id}",
		summary: "Update Entry",
		description:
			"Update an existing career journal entry. If content is updated, moods are automatically re-extracted. Returns 404 if the entry doesn't exist or belongs to another user. Throws 400 if no fields are provided for update.",
	})
	.input(UpdateEntryInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { id, ...updates } = input;
		const userId = context.session.user.id;

		// Re-extract moods if content changed
		const updateData: Parameters<typeof updateEntryQuery>[2] = {};

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

		const entry = await updateEntryQuery(id, userId, updateData);

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
	.route({
		method: "DELETE",
		path: "/entries/{id}",
		summary: "Delete Entry",
		description:
			"Delete a career journal entry permanently. Returns 404 if the entry doesn't exist or belongs to another user.",
	})
	.input(DeleteEntryInputSchema)
	.handler(async ({ input, context }): Promise<{ success: boolean }> => {
		const { id } = input;
		const userId = context.session.user.id;

		const result = await deleteEntryQuery(id, userId);

		if (!result) {
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
	.route({
		method: "PATCH",
		path: "/entries/{id}/flag",
		summary: "Toggle Brag-Worthy Flag",
		description:
			"Toggle the brag-worthy flag on an entry. Brag-worthy entries are highlighted in the brag document for performance reviews and career milestones. Returns 404 if the entry doesn't exist or belongs to another user.",
	})
	.input(ToggleBragWorthyInputSchema)
	.handler(async ({ input, context }): Promise<Entry> => {
		const { id, isBragWorthy } = input;
		const userId = context.session.user.id;

		const entry = await toggleBragWorthyQuery(id, userId, isBragWorthy);

		if (!entry) {
			throw new ORPCError("NOT_FOUND", {
				message: "Entry not found",
				status: 404,
			});
		}

		return entry as Entry;
	});
