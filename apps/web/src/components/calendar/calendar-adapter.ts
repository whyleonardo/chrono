import type { Mood } from "@chrono/types/mood";
import type { CalendarEntryItem, DateSummary } from "./types";

/**
 * Maps mood values to Kibo UI status colors
 */
function mapMoodToStatus(mood: Mood): CalendarEntryItem["status"] {
	switch (mood) {
		case "flow":
			return "success";
		case "learning":
			return "primary";
		case "standard":
			return "default";
		case "buggy":
			return "danger";
		case "meetings":
			return "warning";
		default:
			return "default";
	}
}

interface EntryInput {
	id: string;
	date: string;
	count: number;
	mood: Mood;
	title?: string | null;
}

/**
 * Adapts an entry to Kibo UI Calendar item format
 */
export function adaptEntryToCalendarItem(entry: EntryInput): CalendarEntryItem {
	return {
		id: entry.id,
		name: entry.title ?? "Entry",
		date: entry.date,
		mood: entry.mood,
		count: entry.count,
		status: mapMoodToStatus(entry.mood),
	};
}

/**
 * Groups calendar items by their date
 */
export function groupEntriesByDate(
	entries: CalendarEntryItem[]
): Record<string, CalendarEntryItem[]> {
	const grouped: Record<string, CalendarEntryItem[]> = {};

	for (const entry of entries) {
		if (!grouped[entry.date]) {
			grouped[entry.date] = [];
		}
		grouped[entry.date].push(entry);
	}

	return grouped;
}

/**
 * Gets a summary of entries for a specific date
 */
export function getDateSummary(
	date: string,
	entries: CalendarEntryItem[]
): DateSummary | undefined {
	const dateEntries = entries.filter((e) => e.date === date);

	if (dateEntries.length === 0) {
		return undefined;
	}

	// Count mood occurrences to find dominant mood
	const moodCounts: Record<string, number> = {};
	for (const entry of dateEntries) {
		moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
	}

	const dominantMood = Object.entries(moodCounts).sort(
		(a, b) => b[1] - a[1]
	)[0][0] as Mood;

	return {
		date,
		count: dateEntries.length,
		dominantMood,
		entries: dateEntries,
	};
}
