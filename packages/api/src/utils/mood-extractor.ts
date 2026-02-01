import type { moodEnum } from "@chrono/db/schema/entries";

export type Mood = (typeof moodEnum.enumValues)[number];

export interface TipTapNode {
	type: string;
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

export interface TipTapDoc {
	type: "doc";
	content: TipTapNode[];
}

export function isValidTipTapDoc(value: unknown): value is TipTapDoc {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const doc = value as Record<string, unknown>;

	if (doc.type !== "doc") {
		return false;
	}

	if (!Array.isArray(doc.content)) {
		return false;
	}

	return true;
}

export function isValidMood(value: string): value is Mood {
	const validMoods: Mood[] = [
		"flow",
		"buggy",
		"learning",
		"meetings",
		"standard",
	];
	return validMoods.includes(value as Mood);
}

export function extractMoodsFromContent(content: TipTapDoc): Mood[] {
	const moods: Mood[] = [];

	function traverse(node: TipTapNode): void {
		if (node.type === "moodBlock" && node.attrs?.mood) {
			const mood = node.attrs.mood;
			if (typeof mood === "string" && isValidMood(mood)) {
				moods.push(mood);
			}
		}

		if (node.content) {
			for (const child of node.content) {
				traverse(child);
			}
		}
	}

	for (const node of content.content) {
		traverse(node);
	}

	return [...new Set(moods)];
}

export function calculateDominantMood(moods: Mood[]): Mood | null {
	if (moods.length === 0) {
		return null;
	}

	const counts: Record<Mood, number> = {
		flow: 0,
		buggy: 0,
		learning: 0,
		meetings: 0,
		standard: 0,
	};

	for (const mood of moods) {
		counts[mood]++;
	}

	let dominant: Mood = moods[0]!;
	let maxCount = 0;

	for (const [mood, count] of Object.entries(counts) as [Mood, number][]) {
		if (count > maxCount) {
			maxCount = count;
			dominant = mood;
		}
	}

	return dominant;
}

export function processEntryContent(content: unknown): {
	moods: Mood[];
	dominantMood: Mood | null;
} {
	if (!isValidTipTapDoc(content)) {
		return { moods: [], dominantMood: null };
	}

	const moods = extractMoodsFromContent(content);
	const dominantMood = calculateDominantMood(moods);

	return { moods, dominantMood };
}
