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

		const extractedMoods = extractMoodsFromContent(content);
		const dominantMood = calculateDominantMood(extractedMoods);

		const dateString = new Date(date).toISOString().split("T")[0];

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

export const listEntries = protectedProcedure
	.route({
		method: "GET",
		path: "/entries",
		summary: "List Entries",
		description:
			"List career journal entries with optional filtering by date range, mood, and brag-worthy status. Supports pagination with limit and offset parameters.",
	})
	.input(ListEntriesInputSchema)
	.handler(async ({ input, context }) => {
		const { startDate, endDate, mood, bragWorthy, limit, offset } = input;
		const userId = context.session.user.id;

		const results = await listEntriesQuery(
			userId,
			{
				startDate: startDate
					? new Date(startDate).toISOString().split("T")[0]
					: undefined,
				endDate: endDate
					? new Date(endDate).toISOString().split("T")[0]
					: undefined,
				mood,
				bragWorthy,
			},
			{ limit, offset }
		);

		return results as Entry[];
	});

export const getEntry = protectedProcedure
	.route({
		method: "GET",
		path: "/entries/{id}",
		summary: "Get Entry",
		description:
			"Retrieve a single career journal entry by its ID. Returns 404 if the entry doesn't exist or belongs to another user.",
	})
	.input(GetEntryInputSchema)
	.handler(async ({ input, context }) => {
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

export const updateEntry = protectedProcedure
	.route({
		method: "PUT",
		path: "/entries/{id}",
		summary: "Update Entry",
		description:
			"Update an existing career journal entry. If content is updated, moods are automatically re-extracted. Returns 404 if the entry doesn't exist or belongs to another user. Throws 400 if no fields are provided for update.",
	})
	.input(UpdateEntryInputSchema)
	.handler(async ({ input, context }) => {
		const { id, ...updates } = input;
		const userId = context.session.user.id;

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

export const deleteEntry = protectedProcedure
	.route({
		method: "DELETE",
		path: "/entries/{id}",
		summary: "Delete Entry",
		description:
			"Delete a career journal entry permanently. Returns 404 if the entry doesn't exist or belongs to another user.",
	})
	.input(DeleteEntryInputSchema)
	.handler(async ({ input, context }) => {
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

export const toggleBragWorthy = protectedProcedure
	.route({
		method: "PATCH",
		path: "/entries/{id}/flag",
		summary: "Toggle Brag-Worthy Flag",
		description:
			"Toggle the brag-worthy flag on an entry. Brag-worthy entries are highlighted in the brag document for performance reviews and career milestones. Returns 404 if the entry doesn't exist or belongs to another user.",
	})
	.input(ToggleBragWorthyInputSchema)
	.handler(async ({ input, context }) => {
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
