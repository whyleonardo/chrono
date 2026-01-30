import { z } from "zod";

/**
 * Mood enum for work journal entries
 * Used across database, API, and UI layers
 */
export const MoodEnum = {
	FLOW: "flow",
	BUGGY: "buggy",
	LEARNING: "learning",
	MEETINGS: "meetings",
	STANDARD: "standard",
} as const;

export type Mood = (typeof MoodEnum)[keyof typeof MoodEnum];

export const MoodLabels: Record<Mood, string> = {
	flow: "Flow",
	buggy: "Buggy",
	learning: "Learning",
	meetings: "Meetings",
	standard: "Standard",
};

export const MoodIcons: Record<Mood, string> = {
	flow: "zap",
	buggy: "bug",
	learning: "book-open",
	meetings: "users",
	standard: "circle",
};

/**
 * Tailwind class mappings for mood colors
 * Use with cn() utility from @chrono/ui/lib/utils
 *
 * CSS variables defined in @chrono/ui/src/styles/globals.css
 * with light/dark mode support
 */
export const moodTw = {
	flow: {
		bg: "bg-mood-flow-bg",
		text: "text-mood-flow-text",
		border: "border-mood-flow-border",
		all: "bg-mood-flow-bg text-mood-flow-text border-mood-flow-border",
	},
	buggy: {
		bg: "bg-mood-buggy-bg",
		text: "text-mood-buggy-text",
		border: "border-mood-buggy-border",
		all: "bg-mood-buggy-bg text-mood-buggy-text border-mood-buggy-border",
	},
	learning: {
		bg: "bg-mood-learning-bg",
		text: "text-mood-learning-text",
		border: "border-mood-learning-border",
		all: "bg-mood-learning-bg text-mood-learning-text border-mood-learning-border",
	},
	meetings: {
		bg: "bg-mood-meetings-bg",
		text: "text-mood-meetings-text",
		border: "border-mood-meetings-border",
		all: "bg-mood-meetings-bg text-mood-meetings-text border-mood-meetings-border",
	},
	standard: {
		bg: "bg-mood-standard-bg",
		text: "text-mood-standard-text",
		border: "border-mood-standard-border",
		all: "bg-mood-standard-bg text-mood-standard-text border-mood-standard-border",
	},
} as const;

// Zod schema for validation
export const MoodSchema = z.enum([
	MoodEnum.FLOW,
	MoodEnum.BUGGY,
	MoodEnum.LEARNING,
	MoodEnum.MEETINGS,
	MoodEnum.STANDARD,
]);
