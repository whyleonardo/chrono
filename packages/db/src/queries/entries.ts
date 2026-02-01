import { and, arrayContains, desc, eq, gte, lte } from "drizzle-orm";
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

	return entry ?? null;
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
	// First, get all entries in the date range
	const userEntries = await db.query.entries.findMany({
		where: and(
			eq(entries.userId, userId),
			gte(entries.date, startDate),
			lte(entries.date, endDate)
		),
		orderBy: [entries.date],
	});

	// Group by date and aggregate
	const grouped = new Map<string, typeof userEntries>();
	for (const entry of userEntries) {
		const existing = grouped.get(entry.date) ?? [];
		existing.push(entry);
		grouped.set(entry.date, existing);
	}

	// Convert to heatmap data points
	return Array.from(grouped.entries()).map(([date, dayEntries]) => {
		const allMoods = dayEntries.flatMap((e) => e.moods);
		const uniqueMoods = [...new Set(allMoods)];

		// Get the most common dominant mood
		const dominantMoodCounts = new Map<Mood, number>();
		for (const entry of dayEntries) {
			if (entry.dominantMood) {
				dominantMoodCounts.set(
					entry.dominantMood,
					(dominantMoodCounts.get(entry.dominantMood) ?? 0) + 1
				);
			}
		}
		let dominantMood: Mood | null = null;
		let maxCount = 0;
		for (const [mood, count] of dominantMoodCounts) {
			if (count > maxCount) {
				dominantMood = mood;
				maxCount = count;
			}
		}

		return {
			date,
			moods: uniqueMoods,
			dominantMood,
			entryCount: dayEntries.length,
			hasBragWorthy: dayEntries.some((e) => e.isBragWorthy),
		};
	});
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

	return updatedEntry ?? null;
}

export async function deleteEntry(entryId: string, userId: string) {
	const [deletedEntry] = await db
		.delete(entries)
		.where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
		.returning({
			id: entries.id,
		});

	return deletedEntry ?? null;
}
