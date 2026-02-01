import { describe, expect, it } from "vitest";
import {
	calculateDominantMood,
	extractMoodsFromContent,
	isValidMood,
	isValidTipTapDoc,
	processEntryContent,
	type TipTapDoc,
} from "./mood-extractor";

describe("mood-extractor", () => {
	describe("isValidTipTapDoc", () => {
		it("should return true for valid TipTap document", () => {
			const validDoc: TipTapDoc = {
				type: "doc",
				content: [{ type: "paragraph" }],
			};
			expect(isValidTipTapDoc(validDoc)).toBe(true);
		});

		it("should return false for null", () => {
			expect(isValidTipTapDoc(null)).toBe(false);
		});

		it("should return false for non-object", () => {
			expect(isValidTipTapDoc("string")).toBe(false);
			expect(isValidTipTapDoc(123)).toBe(false);
		});

		it("should return false for document without doc type", () => {
			expect(isValidTipTapDoc({ type: "paragraph" })).toBe(false);
		});

		it("should return false for document without content array", () => {
			expect(isValidTipTapDoc({ type: "doc" })).toBe(false);
			expect(isValidTipTapDoc({ type: "doc", content: "not-array" })).toBe(
				false
			);
		});
	});

	describe("isValidMood", () => {
		it("should return true for valid moods", () => {
			expect(isValidMood("flow")).toBe(true);
			expect(isValidMood("buggy")).toBe(true);
			expect(isValidMood("learning")).toBe(true);
			expect(isValidMood("meetings")).toBe(true);
			expect(isValidMood("standard")).toBe(true);
		});

		it("should return false for invalid moods", () => {
			expect(isValidMood("happy")).toBe(false);
			expect(isValidMood("")).toBe(false);
			expect(isValidMood("FLOW")).toBe(false);
		});
	});

	describe("extractMoodsFromContent", () => {
		it("should extract single mood from content", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "moodBlock",
						attrs: { mood: "flow" },
					},
				],
			};
			expect(extractMoodsFromContent(doc)).toEqual(["flow"]);
		});

		it("should extract multiple moods from content", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "moodBlock",
						attrs: { mood: "flow" },
					},
					{
						type: "moodBlock",
						attrs: { mood: "meetings" },
					},
				],
			};
			const result = extractMoodsFromContent(doc);
			expect(result).toContain("flow");
			expect(result).toContain("meetings");
			expect(result).toHaveLength(2);
		});

		it("should remove duplicate moods", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "moodBlock",
						attrs: { mood: "flow" },
					},
					{
						type: "moodBlock",
						attrs: { mood: "flow" },
					},
				],
			};
			expect(extractMoodsFromContent(doc)).toEqual(["flow"]);
		});

		it("should return empty array when no moods found", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", attrs: { text: "Hello world" } }],
					},
				],
			};
			expect(extractMoodsFromContent(doc)).toEqual([]);
		});

		it("should traverse nested content", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "moodBlock",
								attrs: { mood: "learning" },
							},
						],
					},
				],
			};
			expect(extractMoodsFromContent(doc)).toEqual(["learning"]);
		});

		it("should ignore invalid mood values", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "moodBlock",
						attrs: { mood: "invalid" },
					},
					{
						type: "moodBlock",
						attrs: { mood: "flow" },
					},
				],
			};
			expect(extractMoodsFromContent(doc)).toEqual(["flow"]);
		});

		it("should handle moodBlock without attrs", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "moodBlock",
					},
				],
			};
			expect(extractMoodsFromContent(doc)).toEqual([]);
		});

		it("should handle empty content", () => {
			const doc: TipTapDoc = {
				type: "doc",
				content: [],
			};
			expect(extractMoodsFromContent(doc)).toEqual([]);
		});
	});

	describe("calculateDominantMood", () => {
		it("should return null for empty array", () => {
			expect(calculateDominantMood([])).toBeNull();
		});

		it("should return single mood as dominant", () => {
			expect(calculateDominantMood(["flow"])).toBe("flow");
		});

		it("should return most frequent mood", () => {
			const moods = ["flow", "flow", "buggy", "learning"];
			expect(calculateDominantMood(moods)).toBe("flow");
		});

		it("should return first occurrence in case of tie", () => {
			const moods = ["flow", "buggy", "flow", "buggy"];
			expect(calculateDominantMood(moods)).toBe("flow");
		});

		it("should handle all moods", () => {
			const moods = ["flow", "buggy", "learning", "meetings", "standard"];
			expect(calculateDominantMood(moods)).toBe("flow");
		});
	});

	describe("processEntryContent", () => {
		it("should process valid content and return moods", () => {
			const content: TipTapDoc = {
				type: "doc",
				content: [
					{
						type: "moodBlock",
						attrs: { mood: "flow" },
					},
					{
						type: "moodBlock",
						attrs: { mood: "learning" },
					},
				],
			};
			const result = processEntryContent(content);
			expect(result.moods).toEqual(["flow", "learning"]);
			expect(result.dominantMood).toBe("flow");
		});

		it("should return empty result for invalid content", () => {
			const result = processEntryContent(null);
			expect(result.moods).toEqual([]);
			expect(result.dominantMood).toBeNull();
		});

		it("should handle content with no moods", () => {
			const content: TipTapDoc = {
				type: "doc",
				content: [{ type: "paragraph" }],
			};
			const result = processEntryContent(content);
			expect(result.moods).toEqual([]);
			expect(result.dominantMood).toBeNull();
		});
	});
});
