import type { Mood } from "@chrono/types/mood";

export interface EntrySummary {
	date: string;
	count: number;
	mood: Mood;
}

export const mockEntries: EntrySummary[] = [
	{ date: "2026-02-01", count: 1, mood: "standard" },
	{ date: "2026-02-02", count: 2, mood: "learning" },
	{ date: "2026-02-03", count: 1, mood: "flow" },
	{ date: "2026-02-04", count: 3, mood: "buggy" },
];

export function getEntrySummaryByDate(date: string): EntrySummary | undefined {
	return new Map(mockEntries.map((entry) => [entry.date, entry])).get(date);
}
