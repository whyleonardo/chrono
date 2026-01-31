import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../index";
import { user } from "../schema/auth";
import { entries } from "../schema/entries";
import {
	createEntry,
	deleteEntry,
	getBragWorthyEntries,
	getEntriesByDateRange,
	getEntriesByDominantMood,
	getEntriesByMood,
	getEntriesByUser,
	getEntryById,
	getHeatmapData,
	type Mood,
	updateEntry,
} from "./entries";

const TEST_USER_ID = "test-user-123";
const TEST_DATE = "2026-01-31";

describe("entries queries", () => {
	beforeAll(async () => {
		await db.insert(user).values({
			id: TEST_USER_ID,
			name: "Test User",
			email: "test@example.com",
			emailVerified: true,
		});
	});

	beforeEach(async () => {
		await db.delete(entries).where(eq(entries.userId, TEST_USER_ID));
	});

	describe("createEntry", () => {
		it("should create a new entry", async () => {
			const input = {
				userId: TEST_USER_ID,
				date: TEST_DATE,
				title: "Test Entry",
				content: { type: "doc", content: [] },
				moods: ["flow"] as Mood[],
				dominantMood: "flow" as Mood,
				isBragWorthy: true,
			};

			const entry = await createEntry(input);

			expect(entry).toBeDefined();
			expect(entry.userId).toBe(TEST_USER_ID);
			expect(entry.title).toBe("Test Entry");
			expect(entry.moods).toEqual(["flow"]);
			expect(entry.dominantMood).toBe("flow");
			expect(entry.isBragWorthy).toBe(true);
		});

		it("should create entry with default values", async () => {
			const input = {
				userId: TEST_USER_ID,
				date: TEST_DATE,
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			};

			const entry = await createEntry(input);

			expect(entry.isBragWorthy).toBe(false);
			expect(entry.title).toBeNull();
			expect(entry.dominantMood).toBeNull();
		});
	});

	describe("getEntryById", () => {
		it("should get entry by id", async () => {
			const created = await createEntry({
				userId: TEST_USER_ID,
				date: TEST_DATE,
				title: "Test Entry",
				content: { type: "doc", content: [] },
				moods: ["flow"] as Mood[],
			});

			const entry = await getEntryById(created.id, TEST_USER_ID);

			expect(entry).toBeDefined();
			expect(entry?.id).toBe(created.id);
			expect(entry?.title).toBe("Test Entry");
		});

		it("should return null for non-existent entry", async () => {
			const entry = await getEntryById("non-existent-id", TEST_USER_ID);
			expect(entry).toBeNull();
		});

		it("should not return entry from different user", async () => {
			const created = await createEntry({
				userId: TEST_USER_ID,
				date: TEST_DATE,
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			const entry = await getEntryById(created.id, "different-user");
			expect(entry).toBeNull();
		});
	});

	describe("getEntriesByUser", () => {
		it("should get all entries for user", async () => {
			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-30",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-31",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			const userEntries = await getEntriesByUser(TEST_USER_ID);

			expect(userEntries).toHaveLength(2);
			expect(userEntries[0].date).toBe("2026-01-31");
			expect(userEntries[1].date).toBe("2026-01-30");
		});

		it("should return empty array for user with no entries", async () => {
			const userEntries = await getEntriesByUser("no-entries-user");
			expect(userEntries).toEqual([]);
		});
	});

	describe("getEntriesByDateRange", () => {
		it("should get entries within date range", async () => {
			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-15",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-20",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-25",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			const rangeEntries = await getEntriesByDateRange(
				TEST_USER_ID,
				"2026-01-18",
				"2026-01-22"
			);

			expect(rangeEntries).toHaveLength(1);
			expect(rangeEntries[0].date).toBe("2026-01-20");
		});

		it("should return empty array when no entries in range", async () => {
			const rangeEntries = await getEntriesByDateRange(
				TEST_USER_ID,
				"2026-01-01",
				"2026-01-05"
			);
			expect(rangeEntries).toEqual([]);
		});
	});

	describe("getBragWorthyEntries", () => {
		it("should get only brag-worthy entries", async () => {
			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-20",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
				isBragWorthy: true,
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-21",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
				isBragWorthy: false,
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-22",
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
				isBragWorthy: true,
			});

			const bragEntries = await getBragWorthyEntries(TEST_USER_ID);

			expect(bragEntries).toHaveLength(2);
			expect(bragEntries.every((e) => e.isBragWorthy)).toBe(true);
		});
	});

	describe("getEntriesByMood", () => {
		it("should get entries containing specific mood", async () => {
			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-20",
				content: { type: "doc", content: [] },
				moods: ["flow", "learning"] as Mood[],
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-21",
				content: { type: "doc", content: [] },
				moods: ["meetings"] as Mood[],
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-22",
				content: { type: "doc", content: [] },
				moods: ["flow", "meetings"] as Mood[],
			});

			const flowEntries = await getEntriesByMood(TEST_USER_ID, "flow");

			expect(flowEntries).toHaveLength(2);
		});
	});

	describe("getEntriesByDominantMood", () => {
		it("should get entries with specific dominant mood", async () => {
			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-20",
				content: { type: "doc", content: [] },
				moods: ["flow"] as Mood[],
				dominantMood: "flow" as Mood,
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-21",
				content: { type: "doc", content: [] },
				moods: ["meetings"] as Mood[],
				dominantMood: "meetings" as Mood,
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-22",
				content: { type: "doc", content: [] },
				moods: ["flow", "learning"] as Mood[],
				dominantMood: "flow" as Mood,
			});

			const flowEntries = await getEntriesByDominantMood(TEST_USER_ID, "flow");

			expect(flowEntries).toHaveLength(2);
		});
	});

	describe("getHeatmapData", () => {
		it("should aggregate entries for heatmap", async () => {
			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-20",
				content: { type: "doc", content: [] },
				moods: ["flow"] as Mood[],
				dominantMood: "flow" as Mood,
				isBragWorthy: true,
			});

			await createEntry({
				userId: TEST_USER_ID,
				date: "2026-01-20",
				content: { type: "doc", content: [] },
				moods: ["learning"] as Mood[],
				dominantMood: "learning" as Mood,
				isBragWorthy: false,
			});

			const heatmap = await getHeatmapData(
				TEST_USER_ID,
				"2026-01-15",
				"2026-01-25"
			);

			expect(heatmap).toHaveLength(1);
			expect(heatmap[0].date).toBe("2026-01-20");
			expect(heatmap[0].entryCount).toBe(2);
			expect(heatmap[0].hasBragWorthy).toBe(true);
		});
	});

	describe("updateEntry", () => {
		it("should update entry fields", async () => {
			const created = await createEntry({
				userId: TEST_USER_ID,
				date: TEST_DATE,
				title: "Original Title",
				content: { type: "doc", content: [] },
				moods: ["flow"] as Mood[],
				dominantMood: "flow" as Mood,
				isBragWorthy: false,
			});

			const updated = await updateEntry(created.id, TEST_USER_ID, {
				title: "Updated Title",
				moods: ["learning"] as Mood[],
				dominantMood: "learning" as Mood,
				isBragWorthy: true,
			});

			expect(updated).toBeDefined();
			expect(updated?.title).toBe("Updated Title");
			expect(updated?.moods).toEqual(["learning"]);
			expect(updated?.dominantMood).toBe("learning");
			expect(updated?.isBragWorthy).toBe(true);
		});

		it("should return undefined for non-existent entry", async () => {
			const updated = await updateEntry("non-existent", TEST_USER_ID, {
				title: "Updated",
			});
			expect(updated).toBeUndefined();
		});
	});

	describe("deleteEntry", () => {
		it("should delete entry", async () => {
			const created = await createEntry({
				userId: TEST_USER_ID,
				date: TEST_DATE,
				content: { type: "doc", content: [] },
				moods: [] as Mood[],
			});

			const deleted = await deleteEntry(created.id, TEST_USER_ID);

			expect(deleted).toBeDefined();
			expect(deleted?.id).toBe(created.id);

			const entry = await getEntryById(created.id, TEST_USER_ID);
			expect(entry).toBeNull();
		});

		it("should return undefined for non-existent entry", async () => {
			const deleted = await deleteEntry("non-existent", TEST_USER_ID);
			expect(deleted).toBeUndefined();
		});
	});
});
