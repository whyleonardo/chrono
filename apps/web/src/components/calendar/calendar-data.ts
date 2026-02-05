export interface EntrySummary {
	date: string;
	count: number;
	mood: "calm" | "focused" | "low" | "joy" | "neutral";
}

export const mockEntries: EntrySummary[] = [
	{ date: "2026-02-01", count: 1, mood: "neutral" },
	{ date: "2026-02-02", count: 2, mood: "focused" },
	{ date: "2026-02-03", count: 1, mood: "calm" },
	{ date: "2026-02-04", count: 3, mood: "joy" },
];

export function getEntrySummaryByDate(date: string): EntrySummary | undefined {
	return new Map(mockEntries.map((entry) => [entry.date, entry])).get(date);
}
