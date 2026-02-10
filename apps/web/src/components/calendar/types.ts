import type { Mood } from "@chrono/types/mood";

/**
 * Entry item for display in Kibo UI Calendar
 * Maps to Kibo UI's expected item format
 */
export interface CalendarEntryItem {
	/** Unique identifier for the item */
	id: string;
	/** Display title/text for the entry */
	name: string;
	/** Date string in yyyy-MM-dd format */
	date: string;
	/** Mood associated with the entry */
	mood: Mood;
	/** Number of entries on this date (for summary view) */
	count: number;
	/** Status for color coding (matches Kibo UI pattern) */
	status: "default" | "primary" | "success" | "warning" | "danger";
}

/**
 * Props for custom day cell rendering
 */
export interface DayCellProps {
	/** The date for this cell */
	date: Date;
	/** Entries for this specific day */
	entries: CalendarEntryItem[];
	/** Whether this day is selected */
	isSelected: boolean;
	/** Whether this day is today */
	isToday: boolean;
	/** Whether this day is disabled (future date) */
	isDisabled?: boolean;
	/** Click handler */
	onSelect: (date: Date) => void;
}

/**
 * Summary data for a date (aggregated entries)
 */
export interface DateSummary {
	date: string;
	count: number;
	dominantMood: Mood;
	entries: CalendarEntryItem[];
}
