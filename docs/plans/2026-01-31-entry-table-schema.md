# Entry Table Schema Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Design and implement the core `entries` table schema with mood enum support, content extraction system, and proper indexes for Chrono career journal.

**Architecture:** Define a PostgreSQL table using Drizzle ORM with enum types for moods, JSONB for TipTap content, and calculated fields for dominant mood extraction. Store extracted moods as PostgreSQL arrays with GIN indexing for efficient filtering.

**Tech Stack:** Drizzle ORM, PostgreSQL, TypeScript, Zod (for validation), Better-Auth (for user relation), Vitest (for testing)

---

## Task 1: Create Mood Enum Type

**Files:**
- Create: `packages/db/src/schema/entries.ts`
- Modify: `packages/db/src/schema/index.ts`

**Step 1: Write the mood enum and entries table schema**

```typescript
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// Mood enum for career journal entries
export const moodEnum = pgEnum("mood", [
	"flow", // Deep work, productive coding
	"buggy", // Debugging, frustrating issues
	"learning", // Research, documentation, upskilling
	"meetings", // Syncs, standups, collaboration
	"standard", // Routine tasks, maintenance
]);

// AI brag-worthy suggestion type
export interface AiBragWorthySuggestion {
	suggested: boolean;
	reasoning: string;
	confidence: "high" | "medium" | "low";
}

// TipTap content type
export interface TipTapNode {
	type: string;
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

export interface TipTapDoc {
	type: "doc";
	content: TipTapNode[];
}

// Entries table for career journal
export const entries = pgTable(
	"entries",
	{
		// Primary fields
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		date: date("date").notNull(),
		title: text("title"),

		// Content fields
		content: jsonb("content").notNull(), // TipTap ProseMirror JSON document
		moods: moodEnum("moods").array().notNull(), // Extracted: ["flow", "meetings"]
		dominantMood: moodEnum("dominant_mood"), // Most frequent mood for heatmap

		// Brag-worthy tracking
		isBragWorthy: boolean("is_brag_worthy").default(false).notNull(),

		// AI coaching results (cached)
		aiFeedback: text("ai_feedback"),
		aiSuggestedBullets: jsonb("ai_suggested_bullets"), // string[]
		aiBragWorthySuggestion: jsonb("ai_brag_worthy_suggestion"),
		aiAnalyzedAt: timestamp("ai_analyzed_at"),

		// Timestamps
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		// For heatmap queries (user + date range)
		index("entries_user_date_idx").on(table.userId, table.date),

		// For brag collection filtering
		index("entries_user_brag_idx").on(table.userId, table.isBragWorthy),

		// For mood filtering in heatmap
		index("entries_user_mood_idx").on(table.userId, table.dominantMood),

		// GIN index for array operations (mood filtering)
		index("entries_moods_gin_idx").on(table.moods).using("gin"),
	]
);

// Relations
export const entriesRelations = relations(entries, ({ one }) => ({
	user: one(user, {
		fields: [entries.userId],
		references: [user.id],
	}),
}));

// Type exports
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
```

**Step 2: Export from schema index**

```typescript
export * from "./auth";
export * from "./entries";
```

**Step 3: Generate migration**

Run: `bun run db:generate`

Expected: Migration file created in `packages/db/src/migrations/` with enum and table creation

**Step 4: Run migration**

Run: `bun run db:migrate`

Expected: Database updated successfully, enum and table created

**Step 5: Commit**

```bash
git add packages/db/src/schema/entries.ts packages/db/src/schema/index.ts
git add packages/db/src/migrations/
git commit -m "feat(db): create entries table with mood enum and indexes

- Add moodEnum with 5 mood types (flow, buggy, learning, meetings, standard)
- Create entries table with JSONB content, mood arrays, and AI fields
- Add composite indexes for heatmap and brag collection queries
- Add GIN index for efficient mood array operations
- Export types for Entry and NewEntry

Closes DEV-35"
```

---

## Task 2: Create Mood Extraction Utility

**Files:**
- Create: `packages/api/src/utils/mood-extractor.ts`
- Create: `packages/api/src/utils/__tests__/mood-extractor.test.ts`

**Step 1: Write the extraction functions**

```typescript
// packages/api/src/utils/mood-extractor.ts

import type { TipTapDoc, TipTapNode } from "@chrono/db/schema";

/**
 * Extracts mood values from TipTap JSON content
 * Scans for moodBlock nodes and extracts the mood attribute
 */
export function extractMoodsFromContent(content: TipTapDoc): string[] {
	const moods: string[] = [];

	function traverse(node: TipTapNode): void {
		if (node.type === "moodBlock" && node.attrs?.mood) {
			moods.push(node.attrs.mood as string);
		}

		if (node.content) {
			for (const child of node.content) {
				traverse(child);
			}
		}
	}

	if (content.content) {
		for (const node of content.content) {
			traverse(node);
		}
	}

	// Remove duplicates while preserving order
	return [...new Set(moods)];
}

/**
 * Calculates the dominant mood from an array of moods
 * Returns the most frequent mood, or null if empty
 * In case of ties, returns the last occurring mood
 */
export function calculateDominantMood(moods: string[]): string | null {
	if (moods.length === 0) return null;

	const counts: Record<string, number> = {};
	for (const mood of moods) {
		counts[mood] = (counts[mood] || 0) + 1;
	}

	// Find most frequent, return last occurrence if tie
	let dominant = moods[0];
	let maxCount = 0;

	for (const [mood, count] of Object.entries(counts)) {
		if (count > maxCount) {
			maxCount = count;
			dominant = mood;
		} else if (count === maxCount) {
			// Prefer last occurrence in case of tie
			const lastIndex = moods.lastIndexOf(mood);
			const currentLastIndex = moods.lastIndexOf(dominant);
			if (lastIndex > currentLastIndex) {
				dominant = mood;
			}
		}
	}

	return dominant;
}

/**
 * Type guard to validate TipTap document structure
 */
export function isValidTipTapDoc(value: unknown): value is TipTapDoc {
	if (typeof value !== "object" || value === null) return false;

	const doc = value as Record<string, unknown>;
	if (doc.type !== "doc") return false;
	if (!Array.isArray(doc.content)) return false;

	return true;
}

/**
 * Extracts moods and calculates dominant mood in one operation
 */
export function processEntryMoods(
	content: TipTapDoc
): {
	moods: string[];
	dominantMood: string | null;
} {
	const moods = extractMoodsFromContent(content);
	const dominantMood = calculateDominantMood(moods);

	return { moods, dominantMood };
}
```

**Step 2: Write tests using Vitest**

```typescript
// packages/api/src/utils/__tests__/mood-extractor.test.ts
import { describe, expect, it } from "vitest";
import type { TipTapDoc } from "@chrono/db/schema";
import {
	calculateDominantMood,
	extractMoodsFromContent,
	isValidTipTapDoc,
	processEntryMoods,
} from "../mood-extractor";

describe("extractMoodsFromContent", () => {
	it("extracts moods from moodBlock nodes", () => {
		const content: TipTapDoc = {
			type: "doc",
			content: [
				{
					type: "moodBlock",
					attrs: { mood: "flow" },
				},
				{
					type: "paragraph",
					content: [{ type: "text", text: "Some text" }],
				},
				{
					type: "moodBlock",
					attrs: { mood: "learning" },
				},
			],
		};

		const moods = extractMoodsFromContent(content);
		expect(moods).toEqual(["flow", "learning"]);
	});

	it("removes duplicate moods", () => {
		const content: TipTapDoc = {
			type: "doc",
			content: [
				{ type: "moodBlock", attrs: { mood: "flow" } },
				{ type: "moodBlock", attrs: { mood: "flow" } },
				{ type: "moodBlock", attrs: { mood: "learning" } },
			],
		};

		const moods = extractMoodsFromContent(content);
		expect(moods).toEqual(["flow", "learning"]);
	});

	it("returns empty array when no mood blocks", () => {
		const content: TipTapDoc = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [{ type: "text", text: "Just text" }],
				},
			],
		};

		const moods = extractMoodsFromContent(content);
		expect(moods).toEqual([]);
	});

	it("handles nested content", () => {
		const content: TipTapDoc = {
			type: "doc",
			content: [
				{
					type: "list",
					content: [
						{
							type: "listItem",
							content: [{ type: "moodBlock", attrs: { mood: "buggy" } }],
						},
					],
				},
			],
		};

		const moods = extractMoodsFromContent(content);
		expect(moods).toEqual(["buggy"]);
	});

	it("handles empty document", () => {
		const content: TipTapDoc = {
			type: "doc",
			content: [],
		};

		const moods = extractMoodsFromContent(content);
		expect(moods).toEqual([]);
	});
});

describe("calculateDominantMood", () => {
	it("returns null for empty array", () => {
		expect(calculateDominantMood([])).toBeNull();
	});

	it("returns the only mood for single item", () => {
		expect(calculateDominantMood(["flow"])).toBe("flow");
	});

	it("returns most frequent mood", () => {
		expect(calculateDominantMood(["flow", "flow", "learning"])).toBe("flow");
	});

	it("prefers last occurrence on tie", () => {
		expect(calculateDominantMood(["flow", "learning", "flow", "learning"])).toBe("learning");
	});

	it("handles all same moods", () => {
		expect(calculateDominantMood(["meetings", "meetings", "meetings"])).toBe("meetings");
	});
});

describe("isValidTipTapDoc", () => {
	it("returns true for valid doc", () => {
		const doc = { type: "doc", content: [] };
		expect(isValidTipTapDoc(doc)).toBe(true);
	});

	it("returns false for non-object", () => {
		expect(isValidTipTapDoc(null)).toBe(false);
		expect(isValidTipTapDoc("string")).toBe(false);
	});

	it("returns false for wrong type", () => {
		expect(isValidTipTapDoc({ type: "paragraph", content: [] })).toBe(false);
	});

	it("returns false for missing content array", () => {
		expect(isValidTipTapDoc({ type: "doc" })).toBe(false);
	});
});

describe("processEntryMoods", () => {
	it("extracts and calculates moods", () => {
		const content: TipTapDoc = {
			type: "doc",
			content: [
				{ type: "moodBlock", attrs: { mood: "flow" } },
				{ type: "moodBlock", attrs: { mood: "flow" } },
				{ type: "moodBlock", attrs: { mood: "learning" } },
			],
		};

		const result = processEntryMoods(content);
		expect(result.moods).toEqual(["flow", "learning"]);
		expect(result.dominantMood).toBe("flow");
	});
});
```

**Step 3: Run tests with Vitest**

Run: `cd packages/api && vitest run src/utils/__tests__/mood-extractor.test.ts`

Expected: All tests pass (15 assertions)

**Step 4: Commit**

```bash
git add packages/api/src/utils/mood-extractor.ts packages/api/src/utils/__tests__/mood-extractor.test.ts
git commit -m "feat(api): add mood extraction utilities with tests

- Add extractMoodsFromContent() for parsing TipTap JSON
- Add calculateDominantMood() for determining primary mood
- Add isValidTipTapDoc() type guard for validation
- Add processEntryMoods() combined operation
- Comprehensive test coverage using Vitest

Related to DEV-35"
```

---

## Task 3: Add Database Query Helpers

**Files:**
- Create: `packages/db/src/queries/entries.ts`
- Create: `packages/db/src/queries/__tests__/entries.test.ts`

**Step 1: Write query helpers**

```typescript
// packages/db/src/queries/entries.ts

import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../client";
import { entries, type Entry, type NewEntry } from "../schema";

/**
 * Get entries for heatmap display
 * Returns entries with moods for a date range
 */
export async function getEntriesForHeatmap(
	userId: string,
	startDate: Date,
	endDate: Date
): Promise<
	Array<{
		date: string;
		moods: string[];
		dominantMood: string | null;
		entryCount: number;
		hasBragWorthy: boolean;
	}>
> {
	const result = await db
		.select({
			date: entries.date,
			moods: entries.moods,
			dominantMood: entries.dominantMood,
			entryCount: sql<number>`count(*)::int`,
			hasBragWorthy: sql<boolean>`bool_or(${entries.isBragWorthy})`,
		})
		.from(entries)
		.where(
			and(
				eq(entries.userId, userId),
				gte(entries.date, startDate.toISOString().split("T")[0]),
				lte(entries.date, endDate.toISOString().split("T")[0])
			)
		)
		.groupBy(entries.date, entries.moods, entries.dominantMood)
		.orderBy(entries.date);

	return result;
}

/**
 * Get brag-worthy entries for a user
 */
export async function getBragWorthyEntries(
	userId: string,
	limit = 50,
	offset = 0
): Promise<Entry[]> {
	const result = await db.query.entries.findMany({
		where: and(eq(entries.userId, userId), eq(entries.isBragWorthy, true)),
		orderBy: desc(entries.date),
		limit,
		offset,
	});

	return result;
}

/**
 * Get a single entry by ID
 */
export async function getEntryById(
	entryId: string,
	userId: string
): Promise<Entry | null> {
	const result = await db.query.entries.findFirst({
		where: and(eq(entries.id, entryId), eq(entries.userId, userId)),
	});

	return result ?? null;
}

/**
 * Create a new entry
 */
export async function createEntry(data: NewEntry): Promise<Entry> {
	const [entry] = await db.insert(entries).values(data).returning();

	if (!entry) {
		throw new Error("Failed to create entry");
	}

	return entry;
}

/**
 * Update an entry
 */
export async function updateEntry(
	entryId: string,
	userId: string,
	data: Partial<NewEntry>
): Promise<Entry | null> {
	const [entry] = await db
		.update(entries)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
		.returning();

	return entry ?? null;
}

/**
 * Delete an entry
 */
export async function deleteEntry(
	entryId: string,
	userId: string
): Promise<boolean> {
	const result = await db
		.delete(entries)
		.where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
		.returning();

	return result.length > 0;
}

/**
 * Get entries filtered by mood
 */
export async function getEntriesByMood(
	userId: string,
	mood: string,
	limit = 50,
	offset = 0
): Promise<Entry[]> {
	const result = await db.query.entries.findMany({
		where: and(
			eq(entries.userId, userId),
			sql`${entries.moods} @> ARRAY[${mood}]::mood[]`
		),
		orderBy: desc(entries.date),
		limit,
		offset,
	});

	return result;
}
```

**Step 2: Write query tests using Vitest**

```typescript
// packages/db/src/queries/__tests__/entries.test.ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { entries, user } from "../schema";
import {
	createEntry,
	deleteEntry,
	getBragWorthyEntries,
	getEntriesByMood,
	getEntriesForHeatmap,
	getEntryById,
	updateEntry,
} from "../entries";

describe("entries queries", () => {
	const testUserId = "test-user-entries";

	beforeAll(async () => {
		// Create test user
		await db.insert(user).values({
			id: testUserId,
			name: "Test User",
			email: "test-entries@example.com",
			emailVerified: true,
		});
	});

	afterAll(async () => {
		// Cleanup
		await db.delete(entries).where(eq(entries.userId, testUserId));
		await db.delete(user).where(eq(user.id, testUserId));
	});

	describe("createEntry", () => {
		it("creates a new entry", async () => {
			const content = {
				type: "doc",
				content: [{ type: "paragraph", content: [{ type: "text", text: "Test" }] }],
			};

			const entry = await createEntry({
				userId: testUserId,
				date: "2026-01-31",
				content,
				moods: ["flow"],
				dominantMood: "flow",
				title: "Test Entry",
				isBragWorthy: false,
			});

			expect(entry).toBeDefined();
			expect(entry.userId).toBe(testUserId);
			expect(entry.title).toBe("Test Entry");
			expect(entry.moods).toEqual(["flow"]);
		});
	});

	describe("getEntryById", () => {
		it("returns entry by id", async () => {
			const content = {
				type: "doc",
				content: [{ type: "paragraph" }],
			};

			const created = await createEntry({
				userId: testUserId,
				date: "2026-01-31",
				content,
				moods: ["learning"],
				dominantMood: "learning",
			});

			const found = await getEntryById(created.id, testUserId);
			expect(found).toBeDefined();
			expect(found?.id).toBe(created.id);
		});

		it("returns null for non-existent entry", async () => {
			const found = await getEntryById("non-existent-id", testUserId);
			expect(found).toBeNull();
		});
	});

	describe("getBragWorthyEntries", () => {
		it("returns only brag-worthy entries", async () => {
			const content = { type: "doc", content: [] };

			// Create brag-worthy entry
			await createEntry({
				userId: testUserId,
				date: "2026-01-30",
				content,
				moods: ["flow"],
				dominantMood: "flow",
				isBragWorthy: true,
			});

			const bragEntries = await getBragWorthyEntries(testUserId);
			expect(bragEntries.length).toBeGreaterThanOrEqual(1);
			expect(bragEntries.every((e) => e.isBragWorthy)).toBe(true);
		});
	});

	describe("getEntriesByMood", () => {
		it("returns entries with specific mood", async () => {
			const entries = await getEntriesByMood(testUserId, "flow");
			expect(entries.every((e) => e.moods.includes("flow"))).toBe(true);
		});
	});

	describe("updateEntry", () => {
		it("updates entry fields", async () => {
			const content = { type: "doc", content: [] };

			const created = await createEntry({
				userId: testUserId,
				date: "2026-01-29",
				content,
				moods: ["standard"],
				dominantMood: "standard",
			});

			const updated = await updateEntry(created.id, testUserId, {
				title: "Updated Title",
				isBragWorthy: true,
			});

			expect(updated?.title).toBe("Updated Title");
			expect(updated?.isBragWorthy).toBe(true);
		});
	});

	describe("deleteEntry", () => {
		it("deletes an entry", async () => {
			const content = { type: "doc", content: [] };

			const created = await createEntry({
				userId: testUserId,
				date: "2026-01-28",
				content,
				moods: ["meetings"],
				dominantMood: "meetings",
			});

			const deleted = await deleteEntry(created.id, testUserId);
			expect(deleted).toBe(true);

			const found = await getEntryById(created.id, testUserId);
			expect(found).toBeNull();
		});
	});

	describe("getEntriesForHeatmap", () => {
		it("returns aggregated data for date range", async () => {
			const startDate = new Date("2026-01-01");
			const endDate = new Date("2026-01-31");

			const data = await getEntriesForHeatmap(testUserId, startDate, endDate);
			expect(Array.isArray(data)).toBe(true);
		});
	});
});
```

**Step 3: Run tests with Vitest**

Run: `cd packages/db && vitest run src/queries/__tests__/entries.test.ts`

Expected: All tests pass (requires database connection)

**Step 4: Commit**

```bash
git add packages/db/src/queries/entries.ts packages/db/src/queries/__tests__/entries.test.ts
git commit -m "feat(db): add entry query helpers with comprehensive tests

- Add getEntriesForHeatmap() for heatmap data aggregation
- Add getBragWorthyEntries() for brag collection
- Add CRUD operations: getEntryById, createEntry, updateEntry, deleteEntry
- Add getEntriesByMood() for mood filtering with GIN index
- Full test coverage using Vitest

Related to DEV-35"
```

---

## Task 4: Verify and Finalize

**Step 1: Type check**

Run: `bun run check-types`

Expected: No type errors

**Step 2: Lint and format**

Run: `bun run fix`

Expected: All files formatted, no linting issues

**Step 3: Run all tests with Vitest**

Run: `vitest run`

Expected: All tests pass

**Step 4: Verify database schema**

Run: `bun run db:studio`

Verify in Drizzle Studio:
- [ ] `mood` enum exists with 5 values
- [ ] `entries` table exists with all columns
- [ ] All indexes are present (4 indexes)
- [ ] Foreign key to `user` table is set

**Step 5: Final commit**

```bash
git add -A
git commit -m "test(db): verify entry schema implementation

- All type checks pass
- All tests pass (mood extraction + queries) using Vitest
- Database schema verified in Drizzle Studio
- Linting and formatting complete

Completes DEV-35"
```

---

## Summary

**Deliverables:**
1. `packages/db/src/schema/entries.ts` - Table schema with enum, indexes, and relations
2. `packages/db/src/queries/entries.ts` - Query helpers for CRUD and filtering
3. `packages/api/src/utils/mood-extractor.ts` - Mood extraction utilities
4. Test coverage for all utilities and queries using Vitest
5. Database migration with enum and table

**Performance Features:**
- Composite index for heatmap queries (userId + date)
- GIN index for mood array operations
- Separate index for brag-worthy filtering
- Indexed foreign key for user relation

**Testing Strategy:**
- Unit tests for mood extraction logic using Vitest
- Integration tests for database queries using Vitest
- Type guards for runtime validation
- Edge case coverage (empty docs, ties, duplicates)

**Files Changed:**
- `packages/db/src/schema/entries.ts` (new)
- `packages/db/src/schema/index.ts` (export update)
- `packages/db/src/queries/entries.ts` (new)
- `packages/db/src/queries/__tests__/entries.test.ts` (new)
- `packages/api/src/utils/mood-extractor.ts` (new)
- `packages/api/src/utils/__tests__/mood-extractor.test.ts` (new)
- `packages/db/src/migrations/` (auto-generated)
