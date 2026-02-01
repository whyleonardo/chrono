import { db, entries } from "@chrono/db";
import { user } from "@chrono/db/schema/auth";
import { call } from "@orpc/server";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
	createMockContext,
	createMockOtherUserContext,
} from "../../test-utils/context";
import {
	createEntry,
	deleteEntry,
	getEntry,
	listEntries,
	toggleBragWorthy,
	updateEntry,
} from "../entries";

describe("entryRouter", () => {
	const testUserId = "test-user-api";
	const testUser = {
		id: testUserId,
		name: "Test User",
		email: "test-api@example.com",
		emailVerified: true,
	};

	const mockContext = createMockContext(testUserId);

	beforeAll(async () => {
		await db.insert(user).values(testUser);
	});

	afterAll(async () => {
		await db.delete(entries).where(eq(entries.userId, testUserId));
		await db.delete(user).where(eq(user.id, testUserId));
	});

	beforeEach(async () => {
		await db.delete(entries).where(eq(entries.userId, testUserId));
	});

	describe("createEntry", () => {
		it("creates an entry with extracted moods", async () => {
			const content = {
				type: "doc" as const,
				content: [
					{ type: "moodBlock", attrs: { mood: "flow" } },
					{
						type: "paragraph",
						content: [{ type: "text", text: "Productive day!" }],
					},
					{ type: "moodBlock", attrs: { mood: "learning" } },
				],
			};

			const result = await call(
				createEntry,
				{
					title: "Test Entry",
					content,
					date: new Date().toISOString(),
				},
				{
					context: mockContext,
				}
			);

			expect(result).toBeDefined();
			expect(result.userId).toBe(testUserId);
			expect(result.title).toBe("Test Entry");
			expect(result.moods).toContain("flow");
			expect(result.moods).toContain("learning");
			expect(result.dominantMood).toBeOneOf(["flow", "learning"]);
		});

		it("creates an entry without title", async () => {
			const content = {
				type: "doc" as const,
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", text: "Just text" }],
					},
				],
			};

			const result = await call(
				createEntry,
				{
					content,
					date: new Date().toISOString(),
				},
				{
					context: mockContext,
				}
			);

			expect(result).toBeDefined();
			expect(result.title).toBeNull();
			expect(result.moods).toEqual([]);
			expect(result.dominantMood).toBeNull();
		});
	});

	describe("listEntries", () => {
		it("returns entries for the user", async () => {
			const content = { type: "doc" as const, content: [] };
			await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const result = await call(
				listEntries,
				{ limit: 10, offset: 0 },
				{ context: mockContext }
			);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThanOrEqual(1);
			expect(result[0]?.userId).toBe(testUserId);
		});

		it("filters by date range", async () => {
			const content = { type: "doc" as const, content: [] };
			const date = "2026-01-15T00:00:00.000Z";

			await call(createEntry, { content, date }, { context: mockContext });

			const result = await call(
				listEntries,
				{
					startDate: "2026-01-01T00:00:00.000Z",
					endDate: "2026-01-31T00:00:00.000Z",
					limit: 10,
					offset: 0,
				},
				{ context: mockContext }
			);

			expect(result.length).toBeGreaterThanOrEqual(1);
		});

		it("filters by mood", async () => {
			const content = {
				type: "doc" as const,
				content: [{ type: "moodBlock", attrs: { mood: "flow" } }],
			};

			await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const result = await call(
				listEntries,
				{ mood: "flow", limit: 10, offset: 0 },
				{ context: mockContext }
			);

			expect(result.every((e) => e.moods.includes("flow"))).toBe(true);
		});

		it("filters by bragWorthy", async () => {
			const content = { type: "doc" as const, content: [] };

			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			await call(
				toggleBragWorthy,
				{ id: created.id, isBragWorthy: true },
				{ context: mockContext }
			);

			const result = await call(
				listEntries,
				{ bragWorthy: true, limit: 10, offset: 0 },
				{ context: mockContext }
			);

			expect(result.every((e) => e.isBragWorthy)).toBe(true);
		});
	});

	describe("getEntry", () => {
		it("returns an entry by id", async () => {
			const content = { type: "doc" as const, content: [] };
			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const result = await call(
				getEntry,
				{ id: created.id },
				{ context: mockContext }
			);

			expect(result.id).toBe(created.id);
		});

		it("throws NOT_FOUND for non-existent entry", async () => {
			await expect(
				call(
					getEntry,
					{ id: "00000000-0000-0000-0000-000000000000" },
					{ context: mockContext }
				)
			).rejects.toThrow("Entry not found");
		});

		it("throws NOT_FOUND for other user's entry", async () => {
			const content = { type: "doc" as const, content: [] };

			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const otherUserContext = createMockOtherUserContext();

			await expect(
				call(getEntry, { id: created.id }, { context: otherUserContext })
			).rejects.toThrow("Entry not found");
		});
	});

	describe("updateEntry", () => {
		it("updates entry fields", async () => {
			const content = { type: "doc" as const, content: [] };
			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const newContent = {
				type: "doc" as const,
				content: [
					{ type: "moodBlock", attrs: { mood: "buggy" } },
					{ type: "moodBlock", attrs: { mood: "buggy" } },
				],
			};

			const result = await call(
				updateEntry,
				{
					id: created.id,
					title: "Updated Title",
					content: newContent,
				},
				{ context: mockContext }
			);

			expect(result.title).toBe("Updated Title");
			expect(result.moods).toEqual(["buggy"]);
			expect(result.dominantMood).toBe("buggy");
		});

		it("does not change moods if content unchanged", async () => {
			const content = {
				type: "doc" as const,
				content: [{ type: "moodBlock", attrs: { mood: "flow" } }],
			};

			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const result = await call(
				updateEntry,
				{
					id: created.id,
					title: "Only title changed",
				},
				{ context: mockContext }
			);

			expect(result.moods).toEqual(created.moods);
			expect(result.dominantMood).toBe(created.dominantMood);
		});

		it("throws NOT_FOUND for non-existent entry", async () => {
			await expect(
				call(
					updateEntry,
					{
						id: "00000000-0000-0000-0000-000000000000",
						title: "Updated",
					},
					{ context: mockContext }
				)
			).rejects.toThrow("Entry not found");
		});

		it("throws NOT_FOUND when updating other user's entry", async () => {
			const content = { type: "doc" as const, content: [] };

			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const otherUserContext = createMockOtherUserContext();

			await expect(
				call(
					updateEntry,
					{
						id: created.id,
						title: "Should not work",
					},
					{ context: otherUserContext }
				)
			).rejects.toThrow("Entry not found");
		});
	});

	describe("deleteEntry", () => {
		it("deletes an entry", async () => {
			const content = { type: "doc" as const, content: [] };
			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const result = await call(
				deleteEntry,
				{ id: created.id },
				{ context: mockContext }
			);

			expect(result.success).toBe(true);

			await expect(
				call(getEntry, { id: created.id }, { context: mockContext })
			).rejects.toThrow("Entry not found");
		});

		it("throws NOT_FOUND for non-existent entry", async () => {
			await expect(
				call(
					deleteEntry,
					{ id: "00000000-0000-0000-0000-000000000000" },
					{ context: mockContext }
				)
			).rejects.toThrow("Entry not found");
		});

		it("throws NOT_FOUND when deleting other user's entry", async () => {
			const content = { type: "doc" as const, content: [] };

			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			const otherUserContext = createMockOtherUserContext();

			await expect(
				call(deleteEntry, { id: created.id }, { context: otherUserContext })
			).rejects.toThrow("Entry not found");
		});
	});

	describe("toggleBragWorthy", () => {
		it("toggles brag-worthy flag", async () => {
			const content = { type: "doc" as const, content: [] };
			const created = await call(
				createEntry,
				{ content, date: new Date().toISOString() },
				{ context: mockContext }
			);

			expect(created.isBragWorthy).toBe(false);

			const result = await call(
				toggleBragWorthy,
				{ id: created.id, isBragWorthy: true },
				{ context: mockContext }
			);

			expect(result.isBragWorthy).toBe(true);
		});

		it("throws NOT_FOUND for non-existent entry", async () => {
			await expect(
				call(
					toggleBragWorthy,
					{ id: "00000000-0000-0000-0000-000000000000", isBragWorthy: true },
					{ context: mockContext }
				)
			).rejects.toThrow("Entry not found");
		});
	});
});
