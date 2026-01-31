import { and, arrayContains, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "..";
import { entries, type moodEnum } from "../schema/entries";

export type Mood = (typeof moodEnum.enumValues)[number];

export interface CreateEntryInput {
	userId: string;
	date: string;
	title?: string;
	content: unknown;
	moods: Mood[];
	dominantMood?: Mood | null;
	isBragWorthy?: boolean;
}

export interface UpdateEntryInput {
	title?: string;
	content?: unknown;
	moods?: Mood[];
	dominantMood?: Mood | null;
	isBragWorthy?: boolean;
	aiFeedback?: string;
	aiSuggestedBullets?: string[];
	aiBragWorthySuggestion?: {
		suggested: boolean;
		reasoning: string;
		confidence: "high" | "medium" | "low";
	};
	aiAnalyzedAt?: Date;
}

export async function createEntry(input: CreateEntryInput) {
	const [entry] = await db
		.insert(entries)
		.values({
			userId: input.userId,
			date: input.date,
			title: input.title,
			content: input.content,
			moods: input.moods,
			dominantMood: input.dominantMood,
			isBragWorthy: input.isBragWorthy ?? false,
		})
		.returning({
			id: entries.id,
			userId: entries.userId,
			date: entries.date,
			title: entries.title,
			content: entries.content,
			moods: entries.moods,
			dominantMood: entries.dominantMood,
			isBragWorthy: entries.isBragWorthy,
			createdAt: entries.createdAt,
			updatedAt: entries.updatedAt,
		});

	return entry;
}

export async function getEntryById(entryId: string, userId: string) {
	const entry = await db.query.entries.findFirst({
		where: and(eq(entries.id, entryId), eq(entries.userId, userId)),
	});

	return entry;
}

export async function getEntriesByUser(userId: string) {
	const userEntries = await db.query.entries.findMany({
		where: eq(entries.userId, userId),
		orderBy: [desc(entries.date)],
	});

	return userEntries;
}

export async function getEntriesByDateRange(
	userId: string,
	startDate: string,
	endDate: string
) {
	const userEntries = await db.query.entries.findMany({
		where: and(
			eq(entries.userId, userId),
			gte(entries.date, startDate),
			lte(entries.date, endDate)
		),
		orderBy: [entries.date],
	});

	return userEntries;
}

export async function getBragWorthyEntries(userId: string) {
	const bragEntries = await db.query.entries.findMany({
		where: and(eq(entries.userId, userId), eq(entries.isBragWorthy, true)),
		orderBy: [desc(entries.date)],
	});

	return bragEntries;
}

export async function getEntriesByMood(userId: string, mood: Mood) {
	const moodEntries = await db.query.entries.findMany({
		where: and(
			eq(entries.userId, userId),
			arrayContains(entries.moods, [mood])
		),
		orderBy: [desc(entries.date)],
	});

	return moodEntries;
}

export async function getEntriesByDominantMood(userId: string, mood: Mood) {
	const moodEntries = await db.query.entries.findMany({
		where: and(eq(entries.userId, userId), eq(entries.dominantMood, mood)),
		orderBy: [desc(entries.date)],
	});

	return moodEntries;
}

export interface HeatmapDataPoint {
	date: string;
	moods: Mood[];
	dominantMood: Mood | null;
	entryCount: number;
	hasBragWorthy: boolean;
}

export async function getHeatmapData(
	userId: string,
	startDate: string,
	endDate: string
): Promise<HeatmapDataPoint[]> {
	const result = await db
		.select({
			date: entries.date,
			moods: entries.moods,
			dominantMood: entries.dominantMood,
			entryCount: sql<number>`count(*)::int`,
			hasBragWorthy: sql<boolean>`bool_or(${entries.isBragWorthy})`,
		})
		.from(entries)
		.where(
			and(
				eq(entries.userId, userId),
				gte(entries.date, startDate),
				lte(entries.date, endDate)
			)
		)
		.groupBy(entries.date, entries.moods, entries.dominantMood)
		.orderBy(entries.date);

	return result.map((row) => ({
		date: row.date,
		moods: row.moods as Mood[],
		dominantMood: row.dominantMood as Mood | null,
		entryCount: row.entryCount,
		hasBragWorthy: row.hasBragWorthy,
	}));
}

export async function updateEntry(
	entryId: string,
	userId: string,
	input: UpdateEntryInput
) {
	const [updatedEntry] = await db
		.update(entries)
		.set({
			...(input.title !== undefined && { title: input.title }),
			...(input.content !== undefined && { content: input.content }),
			...(input.moods !== undefined && { moods: input.moods }),
			...(input.dominantMood !== undefined && {
				dominantMood: input.dominantMood,
			}),
			...(input.isBragWorthy !== undefined && {
				isBragWorthy: input.isBragWorthy,
			}),
			...(input.aiFeedback !== undefined && { aiFeedback: input.aiFeedback }),
			...(input.aiSuggestedBullets !== undefined && {
				aiSuggestedBullets: input.aiSuggestedBullets,
			}),
			...(input.aiBragWorthySuggestion !== undefined && {
				aiBragWorthySuggestion: input.aiBragWorthySuggestion,
			}),
			...(input.aiAnalyzedAt !== undefined && {
				aiAnalyzedAt: input.aiAnalyzedAt,
			}),
		})
		.where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
		.returning({
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
		});

	return updatedEntry;
}

export async function deleteEntry(entryId: string, userId: string) {
	const [deletedEntry] = await db
		.delete(entries)
		.where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
		.returning({
			id: entries.id,
		});

	return deletedEntry;
}
