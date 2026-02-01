# Entry CRUD API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive CRUD endpoints for the Entry resource with automatic mood extraction from TipTap JSON content using ORPC.

**Architecture:** Create a RESTful API using ORPC with Zod validation, Better-Auth authentication middleware, and automatic mood extraction. Endpoints support filtering, pagination, and proper error handling.

**Tech Stack:** ORPC, Zod, Drizzle ORM, PostgreSQL, Better-Auth, TypeScript, Vitest

---

## Prerequisites

**Before starting:** The database schema should already be created (see plan `2026-01-31-entry-table-schema.md`). Run these checks:

```bash
# Verify schema exists
bun run db:studio

# Check mood-extractor utilities exist
ls packages/api/src/utils/mood-extractor.ts
```

**Required reading:**
- `packages/db/src/schema/entries.ts` - Database schema
- `packages/api/src/utils/mood-extractor.ts` - Mood extraction logic
- `packages/types/src/entry.ts` - Entry types and Zod schemas

---

## Task 1: Create Entry Input/Output Schemas

**Files:**
- Modify: `packages/types/src/entry.ts`

**Step 1: Update Entry types with TipTap content and moods**

```typescript
// packages/types/src/entry.ts

import { z } from "zod";
import { MoodSchema } from "./mood";

// TipTap content types
export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
}

export interface TipTapDoc {
  type: "doc";
  content: TipTapNode[];
}

// Entry model with full fields
export interface Entry {
  id: string;
  userId: string;
  date: string; // ISO date string
  title: string | null;
  content: TipTapDoc;
  moods: string[];
  dominantMood: string | null;
  isBragWorthy: boolean;
  aiFeedback: string | null;
  aiSuggestedBullets: string[] | null;
  aiBragWorthySuggestion: {
    suggested: boolean;
    reasoning: string;
    confidence: "high" | "medium" | "low";
  } | null;
  aiAnalyzedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schema for TipTap content
export const TipTapNodeSchema: z.ZodSchema<TipTapNode> = z.object({
  type: z.string(),
  attrs: z.record(z.unknown()).optional(),
  content: z.array(z.lazy(() => TipTapNodeSchema)).optional(),
});

export const TipTapDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(TipTapNodeSchema),
});

// Zod schemas for API validation
export const EntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  date: z.string().datetime(),
  title: z.string().max(255).nullable(),
  content: TipTapDocSchema,
  moods: z.array(MoodSchema),
  dominantMood: MoodSchema.nullable(),
  isBragWorthy: z.boolean().default(false),
  aiFeedback: z.string().nullable(),
  aiSuggestedBullets: z.array(z.string()).nullable(),
  aiBragWorthySuggestion: z.object({
    suggested: z.boolean(),
    reasoning: z.string(),
    confidence: z.enum(["high", "medium", "low"]),
  }).nullable(),
  aiAnalyzedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEntryInputSchema = z.object({
  title: z.string().max(255).optional(),
  content: TipTapDocSchema,
  date: z.string().datetime(),
});

export const UpdateEntryInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(255).optional(),
  content: TipTapDocSchema.optional(),
  date: z.string().datetime().optional(),
});

export const ListEntriesInputSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  mood: MoodSchema.optional(),
  bragWorthy: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const GetEntryInputSchema = z.object({
  id: z.string().uuid(),
});

export const ToggleBragWorthyInputSchema = z.object({
  id: z.string().uuid(),
  isBragWorthy: z.boolean(),
});

export const DeleteEntryInputSchema = z.object({
  id: z.string().uuid(),
});

// Type exports
export type CreateEntryInput = z.infer<typeof CreateEntryInputSchema>;
export type UpdateEntryInput = z.infer<typeof UpdateEntryInputSchema>;
export type ListEntriesInput = z.infer<typeof ListEntriesInputSchema>;
export type GetEntryInput = z.infer<typeof GetEntryInputSchema>;
export type ToggleBragWorthyInput = z.infer<typeof ToggleBragWorthyInputSchema>;
export type DeleteEntryInput = z.infer<typeof DeleteEntryInputSchema>;
```

**Step 2: Run type check**

Run: `bun run check-types`

Expected: No type errors

**Step 3: Commit**

```bash
git add packages/types/src/entry.ts
git commit -m "feat(types): update Entry types with TipTap and API schemas

- Add TipTap content types (TipTapNode, TipTapDoc)
- Update Entry interface with full database fields
- Add Zod schemas for all API operations
- Add Create/Update/List/Get/Delete input schemas
- Add ToggleBragWorthy schema

Related to DEV-23"
```

---

## Task 2: Create Authentication Middleware

**Files:**
- Create: `packages/api/src/middleware/auth.ts`
- Modify: `packages/api/src/index.ts`

**Step 1: Write auth middleware**

```typescript
// packages/api/src/middleware/auth.ts

import { ORPCError, type MiddlewareFunction } from "@orpc/core";
import { auth } from "@chrono/auth";

export interface AuthContext {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Authentication middleware for ORPC
 * Validates the session and adds user to context
 */
export const authMiddleware: MiddlewareFunction<unknown, AuthContext> = async (
  { context, next }
) => {
  // Get session from Better-Auth
  const session = await auth.api.getSession({
    headers: context.headers,
  });

  if (!session || !session.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Authentication required",
      status: 401,
    });
  }

  // Add user to context for downstream handlers
  return next({
    context: {
      ...context,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    },
  });
};
```

**Step 2: Export from index**

```typescript
// packages/api/src/index.ts

export * from "./routers/entries";
export * from "./middleware/auth";
```

**Step 3: Run type check**

Run: `bun run check-types`

Expected: No type errors

**Step 4: Commit**

```bash
git add packages/api/src/middleware/auth.ts packages/api/src/index.ts
git commit -m "feat(api): add authentication middleware

- Create authMiddleware with Better-Auth integration
- Extract user session and add to context
- Throw UNAUTHORIZED error when no session
- Export from main index

Related to DEV-23"
```

---

## Task 3: Implement Entry CRUD Router

**Files:**
- Create: `packages/api/src/routers/entries.ts`

**Step 1: Write the entry router with all endpoints**

```typescript
// packages/api/src/routers/entries.ts

import { o } from "@orpc/server";
import { ORPCError } from "@orpc/core";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db, entries } from "@chrono/db";
import {
  CreateEntryInputSchema,
  UpdateEntryInputSchema,
  ListEntriesInputSchema,
  GetEntryInputSchema,
  ToggleBragWorthyInputSchema,
  DeleteEntryInputSchema,
  type Entry,
} from "@chrono/types";
import { extractMoodsFromContent, calculateDominantMood } from "../utils/mood-extractor";
import { authMiddleware, type AuthContext } from "../middleware/auth";

/**
 * Entry router with full CRUD operations
 */
export const entryRouter = o.router({
  // 1. Create Entry - POST /entries
  create: o
    .procedure
    .input(CreateEntryInputSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }): Promise<Entry> => {
      const { title, content, date } = input;
      const { user } = context as AuthContext;

      // Extract moods from content
      const extractedMoods = extractMoodsFromContent(content);
      const dominantMood = calculateDominantMood(extractedMoods);

      const [entry] = await db
        .insert(entries)
        .values({
          userId: user.id,
          title: title ?? null,
          content,
          moods: extractedMoods,
          dominantMood,
          date: new Date(date),
          isBragWorthy: false,
        })
        .returning();

      if (!entry) {
        throw new ORPCError("INTERNAL_ERROR", {
          message: "Failed to create entry",
          status: 500,
        });
      }

      return entry as Entry;
    }),

  // 2. List Entries - GET /entries?filters
  list: o
    .procedure
    .input(ListEntriesInputSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }): Promise<Entry[]> => {
      const { startDate, endDate, mood, bragWorthy, limit, offset } = input;
      const { user } = context as AuthContext;

      let query = db
        .select()
        .from(entries)
        .where(eq(entries.userId, user.id));

      if (startDate) {
        query = query.where(gte(entries.date, new Date(startDate)));
      }

      if (endDate) {
        query = query.where(lte(entries.date, new Date(endDate)));
      }

      if (mood) {
        // Use GIN index for array contains
        query = query.where(sql`${entries.moods} @> ARRAY[${mood}]::mood[]`);
      }

      if (bragWorthy !== undefined) {
        query = query.where(eq(entries.isBragWorthy, bragWorthy));
      }

      const results = await query
        .orderBy(desc(entries.date))
        .limit(limit)
        .offset(offset);

      return results as Entry[];
    }),

  // 3. Get Single Entry - GET /entries/:id
  get: o
    .procedure
    .input(GetEntryInputSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }): Promise<Entry> => {
      const { id } = input;
      const { user } = context as AuthContext;

      const entry = await db.query.entries.findFirst({
        where: and(
          eq(entries.id, id),
          eq(entries.userId, user.id)
        ),
      });

      if (!entry) {
        throw new ORPCError("NOT_FOUND", {
          message: "Entry not found",
          status: 404,
        });
      }

      return entry as Entry;
    }),

  // 4. Update Entry - PUT /entries/:id
  update: o
    .procedure
    .input(UpdateEntryInputSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }): Promise<Entry> => {
      const { id, ...updates } = input;
      const { user } = context as AuthContext;

      // Re-extract moods if content changed
      let moodUpdates: { moods?: string[]; dominantMood?: string | null } = {};
      if (updates.content) {
        const extractedMoods = extractMoodsFromContent(updates.content);
        const dominantMood = calculateDominantMood(extractedMoods);
        moodUpdates = { moods: extractedMoods, dominantMood };
      }

      const dateUpdate = updates.date ? { date: new Date(updates.date) } : {};

      const [entry] = await db
        .update(entries)
        .set({
          ...updates,
          ...moodUpdates,
          ...dateUpdate,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(entries.id, id),
            eq(entries.userId, user.id)
          )
        )
        .returning();

      if (!entry) {
        throw new ORPCError("NOT_FOUND", {
          message: "Entry not found",
          status: 404,
        });
      }

      return entry as Entry;
    }),

  // 5. Delete Entry - DELETE /entries/:id
  delete: o
    .procedure
    .input(DeleteEntryInputSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }): Promise<{ success: boolean }> => {
      const { id } = input;
      const { user } = context as AuthContext;

      const result = await db
        .delete(entries)
        .where(
          and(
            eq(entries.id, id),
            eq(entries.userId, user.id)
          )
        )
        .returning();

      if (result.length === 0) {
        throw new ORPCError("NOT_FOUND", {
          message: "Entry not found",
          status: 404,
        });
      }

      return { success: true };
    }),

  // 6. Toggle Brag-Worthy Flag - PATCH /entries/:id/flag
  toggleBragWorthy: o
    .procedure
    .input(ToggleBragWorthyInputSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }): Promise<Entry> => {
      const { id, isBragWorthy } = input;
      const { user } = context as AuthContext;

      const [entry] = await db
        .update(entries)
        .set({ isBragWorthy })
        .where(
          and(
            eq(entries.id, id),
            eq(entries.userId, user.id)
          )
        )
        .returning();

      if (!entry) {
        throw new ORPCError("NOT_FOUND", {
          message: "Entry not found",
          status: 404,
        });
      }

      return entry as Entry;
    }),
});

export type EntryRouter = typeof entryRouter;
```

**Step 2: Run type check**

Run: `bun run check-types`

Expected: No type errors

**Step 3: Commit**

```bash
git add packages/api/src/routers/entries.ts
git commit -m "feat(api): implement entry CRUD endpoints

- Create entry router with 6 endpoints
- Implement create with automatic mood extraction
- Implement list with filtering (date, mood, bragWorthy)
- Implement get by id with ownership check
- Implement update with mood re-extraction on content change
- Implement delete with ownership verification
- Implement toggleBragWorthy flag
- Add authMiddleware to all endpoints
- Proper error handling with ORPCError

Related to DEV-23"
```

---

## Task 4: Export and Register Router

**Files:**
- Modify: `packages/api/src/index.ts`

**Step 1: Export router from index**

```typescript
// packages/api/src/index.ts

export * from "./routers/entries";
export * from "./middleware/auth";

// Re-export the entry router for app integration
export { entryRouter } from "./routers/entries";
```

**Step 2: Run type check**

Run: `bun run check-types`

Expected: No type errors

**Step 3: Commit**

```bash
git add packages/api/src/index.ts
git commit -m "chore(api): export entry router from main index

- Re-export entryRouter for app integration
- Maintain clean API surface

Related to DEV-23"
```

---

## Task 5: Write Unit Tests for Entry Router

**Files:**
- Create: `packages/api/src/routers/__tests__/entries.test.ts`
- Create: `packages/api/src/test-utils/context.ts`

**Step 1: Create test utilities for mocking context**

```typescript
// packages/api/src/test-utils/context.ts

import type { AuthContext } from "../middleware/auth";

/**
 * Creates a mock authentication context for testing
 * Bypasses actual Better-Auth session validation
 */
export function createMockContext(
  userId = "test-user-api",
  email = "test-api@example.com",
  name = "Test User"
): AuthContext {
  return {
    user: {
      id: userId,
      email,
      name,
    },
  };
}

/**
 * Creates a mock context for a different user (for testing authorization)
 */
export function createMockOtherUserContext(
  userId = "other-user-api",
  email = "other@example.com",
  name = "Other User"
): AuthContext {
  return {
    user: {
      id: userId,
      email,
      name,
    },
  };
}
```

**Step 2: Write comprehensive tests using ORPC `call()` utility**

```typescript
// packages/api/src/routers/__tests__/entries.test.ts

import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import { call } from "@orpc/server";
import { db, entries, user } from "@chrono/db";
import { entryRouter } from "../entries";
import { createMockContext, createMockOtherUserContext } from "../../test-utils/context";

describe("entryRouter", () => {
  const testUserId = "test-user-api";
  const testUser = {
    id: testUserId,
    name: "Test User",
    email: "test-api@example.com",
    emailVerified: true,
  };

  // Mock auth context
  const mockContext = createMockContext(testUserId);

  beforeAll(async () => {
    // Create test user
    await db.insert(user).values(testUser);
  });

  afterAll(async () => {
    // Cleanup
    await db.delete(entries).where(eq(entries.userId, testUserId));
    await db.delete(user).where(eq(user.id, testUserId));
  });

  beforeEach(async () => {
    // Clear entries before each test
    await db.delete(entries).where(eq(entries.userId, testUserId));
  });

  describe("create", () => {
    it("creates an entry with extracted moods", async () => {
      const content = {
        type: "doc" as const,
        content: [
          { type: "moodBlock", attrs: { mood: "flow" } },
          { type: "paragraph", content: [{ type: "text", text: "Productive day!" }] },
          { type: "moodBlock", attrs: { mood: "learning" } },
        ],
      };

      // Use ORPC call() to invoke procedure directly
      const result = await call(entryRouter.create, {
        title: "Test Entry",
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

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
        content: [{ type: "paragraph", content: [{ type: "text", text: "Just text" }] }],
      };

      const result = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      expect(result).toBeDefined();
      expect(result.title).toBeNull();
      expect(result.moods).toEqual([]);
      expect(result.dominantMood).toBeNull();
    });
  });

  describe("list", () => {
    it("returns entries for the user", async () => {
      // Create test entries
      const content = { type: "doc" as const, content: [] };
      await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.list, {
        limit: 10,
        offset: 0,
      }, {
        context: mockContext,
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].userId).toBe(testUserId);
    });

    it("filters by date range", async () => {
      const content = { type: "doc" as const, content: [] };
      const date = "2026-01-15T00:00:00.000Z";
      
      await call(entryRouter.create, {
        content,
        date,
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.list, {
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-01-31T00:00:00.000Z",
        limit: 10,
        offset: 0,
      }, {
        context: mockContext,
      });

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("filters by mood", async () => {
      const content = {
        type: "doc" as const,
        content: [{ type: "moodBlock", attrs: { mood: "flow" } }],
      };
      
      await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.list, {
        mood: "flow",
        limit: 10,
        offset: 0,
      }, {
        context: mockContext,
      });

      expect(result.every(e => e.moods.includes("flow"))).toBe(true);
    });

    it("filters by bragWorthy", async () => {
      const content = { type: "doc" as const, content: [] };
      
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      await call(entryRouter.toggleBragWorthy, {
        id: created.id,
        isBragWorthy: true,
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.list, {
        bragWorthy: true,
        limit: 10,
        offset: 0,
      }, {
        context: mockContext,
      });

      expect(result.every(e => e.isBragWorthy)).toBe(true);
    });
  });

  describe("get", () => {
    it("returns an entry by id", async () => {
      const content = { type: "doc" as const, content: [] };
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.get, {
        id: created.id,
      }, {
        context: mockContext,
      });

      expect(result.id).toBe(created.id);
    });

    it("throws NOT_FOUND for non-existent entry", async () => {
      await expect(
        call(entryRouter.get, {
          id: "00000000-0000-0000-0000-000000000000",
        }, {
          context: mockContext,
        })
      ).rejects.toThrow("Entry not found");
    });

    it("throws NOT_FOUND for other user's entry", async () => {
      const content = { type: "doc" as const, content: [] };
      
      // Create entry as test user
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      // Try to access as other user
      const otherUserContext = createMockOtherUserContext();
      
      await expect(
        call(entryRouter.get, {
          id: created.id,
        }, {
          context: otherUserContext,
        })
      ).rejects.toThrow("Entry not found");
    });
  });

  describe("update", () => {
    it("updates entry fields", async () => {
      const content = { type: "doc" as const, content: [] };
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      const newContent = {
        type: "doc" as const,
        content: [
          { type: "moodBlock", attrs: { mood: "buggy" } },
          { type: "moodBlock", attrs: { mood: "buggy" } },
        ],
      };

      const result = await call(entryRouter.update, {
        id: created.id,
        title: "Updated Title",
        content: newContent,
      }, {
        context: mockContext,
      });

      expect(result.title).toBe("Updated Title");
      expect(result.moods).toEqual(["buggy"]);
      expect(result.dominantMood).toBe("buggy");
    });

    it("does not change moods if content unchanged", async () => {
      const content = {
        type: "doc" as const,
        content: [{ type: "moodBlock", attrs: { mood: "flow" } }],
      };
      
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.update, {
        id: created.id,
        title: "Only title changed",
      }, {
        context: mockContext,
      });

      expect(result.moods).toEqual(created.moods);
      expect(result.dominantMood).toBe(created.dominantMood);
    });

    it("throws NOT_FOUND for non-existent entry", async () => {
      await expect(
        call(entryRouter.update, {
          id: "00000000-0000-0000-0000-000000000000",
          title: "Updated",
        }, {
          context: mockContext,
        })
      ).rejects.toThrow("Entry not found");
    });

    it("throws NOT_FOUND when updating other user's entry", async () => {
      const content = { type: "doc" as const, content: [] };
      
      // Create entry as test user
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      // Try to update as other user
      const otherUserContext = createMockOtherUserContext();
      
      await expect(
        call(entryRouter.update, {
          id: created.id,
          title: "Should not work",
        }, {
          context: otherUserContext,
        })
      ).rejects.toThrow("Entry not found");
    });
  });

  describe("delete", () => {
    it("deletes an entry", async () => {
      const content = { type: "doc" as const, content: [] };
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      const result = await call(entryRouter.delete, {
        id: created.id,
      }, {
        context: mockContext,
      });

      expect(result.success).toBe(true);

      // Verify deletion
      await expect(
        call(entryRouter.get, {
          id: created.id,
        }, {
          context: mockContext,
        })
      ).rejects.toThrow("Entry not found");
    });

    it("throws NOT_FOUND for non-existent entry", async () => {
      await expect(
        call(entryRouter.delete, {
          id: "00000000-0000-0000-0000-000000000000",
        }, {
          context: mockContext,
        })
      ).rejects.toThrow("Entry not found");
    });

    it("throws NOT_FOUND when deleting other user's entry", async () => {
      const content = { type: "doc" as const, content: [] };
      
      // Create entry as test user
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      // Try to delete as other user
      const otherUserContext = createMockOtherUserContext();
      
      await expect(
        call(entryRouter.delete, {
          id: created.id,
        }, {
          context: otherUserContext,
        })
      ).rejects.toThrow("Entry not found");
    });
  });

  describe("toggleBragWorthy", () => {
    it("toggles brag-worthy flag", async () => {
      const content = { type: "doc" as const, content: [] };
      const created = await call(entryRouter.create, {
        content,
        date: new Date().toISOString(),
      }, {
        context: mockContext,
      });

      expect(created.isBragWorthy).toBe(false);

      const result = await call(entryRouter.toggleBragWorthy, {
        id: created.id,
        isBragWorthy: true,
      }, {
        context: mockContext,
      });

      expect(result.isBragWorthy).toBe(true);
    });

    it("throws NOT_FOUND for non-existent entry", async () => {
      await expect(
        call(entryRouter.toggleBragWorthy, {
          id: "00000000-0000-0000-0000-000000000000",
          isBragWorthy: true,
        }, {
          context: mockContext,
        })
      ).rejects.toThrow("Entry not found");
    });
  });
});
```

**Step 3: Write tests for mocking with `implement()`**

```typescript
// packages/api/src/routers/__tests__/entries-mock.test.ts

import { describe, expect, it } from "vitest";
import { implement } from "@orpc/server";
import { entryRouter } from "../entries";

describe("entryRouter mocking with implement()", () => {
  /**
   * Example of how to mock procedures for frontend testing
   * or when you want to bypass actual database calls
   */

  it("can mock create procedure", async () => {
    const mockEntry = {
      id: "mock-id-123",
      userId: "test-user",
      date: "2026-01-31",
      title: "Mock Entry",
      content: { type: "doc" as const, content: [] },
      moods: ["flow"],
      dominantMood: "flow",
      isBragWorthy: false,
      aiFeedback: null,
      aiSuggestedBullets: null,
      aiBragWorthySuggestion: null,
      aiAnalyzedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create mocked version of create procedure
    const mockCreate = implement(entryRouter.create).handler(() => mockEntry);

    // Test that mock returns expected data
    const result = await mockCreate({
      input: {
        title: "Any title",
        content: { type: "doc", content: [] },
        date: new Date().toISOString(),
      },
      context: { user: { id: "test-user", email: "test@test.com", name: null } },
    });

    expect(result.id).toBe("mock-id-123");
    expect(result.title).toBe("Mock Entry");
  });

  it("can mock list procedure", async () => {
    const mockEntries = [
      {
        id: "mock-1",
        userId: "test-user",
        date: "2026-01-31",
        title: "Entry 1",
        content: { type: "doc" as const, content: [] },
        moods: ["flow"],
        dominantMood: "flow",
        isBragWorthy: true,
        aiFeedback: null,
        aiSuggestedBullets: null,
        aiBragWorthySuggestion: null,
        aiAnalyzedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockList = implement(entryRouter.list).handler(() => mockEntries);

    const result = await mockList({
      input: { limit: 10, offset: 0 },
      context: { user: { id: "test-user", email: "test@test.com", name: null } },
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Entry 1");
  });
});
```
```

**Step 4: Run tests**

Run: `cd packages/api && vitest run src/routers/__tests__/`

Expected: All tests pass (35+ assertions)

**Step 5: Commit**

```bash
git add packages/api/src/test-utils/context.ts
git add packages/api/src/routers/__tests__/entries.test.ts
git add packages/api/src/routers/__tests__/entries-mock.test.ts
git commit -m "test(api): add comprehensive ORPC tests for entry router

- Use call() utility for direct procedure invocation
- Create mock context helpers (createMockContext, createMockOtherUserContext)
- Test create with mood extraction
- Test list with various filters (date, mood, bragWorthy)
- Test get with NOT_FOUND error and ownership verification
- Test update with and without content change
- Test delete with verification and authorization
- Test toggleBragWorthy
- Add mocking examples using implement() for frontend testing
- All CRUD operations covered

Related to DEV-23"
```

---

## Task 6: Create OpenAPI Documentation

**Files:**
- Create: `packages/api/src/openapi.ts`
- Modify: `packages/api/src/index.ts`

**Step 1: Generate OpenAPI spec**

```typescript
// packages/api/src/openapi.ts

import { generateOpenAPI } from "@orpc/openapi";
import { entryRouter } from "./routers/entries";

/**
 * Generate OpenAPI specification from entry router
 */
export const openAPISpec = generateOpenAPI({
  router: entryRouter,
  info: {
    title: "Chrono Entry API",
    version: "1.0.0",
    description: "API for managing career journal entries with mood tracking",
  },
  servers: [
    {
      url: "/api",
      description: "Local development server",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
});

export default openAPISpec;
```

**Step 2: Export from index**

```typescript
// packages/api/src/index.ts - add to existing file

export { openAPISpec } from "./openapi";
```

**Step 3: Run type check**

Run: `bun run check-types`

Expected: No type errors

**Step 4: Commit**

```bash
git add packages/api/src/openapi.ts packages/api/src/index.ts
git commit -m "docs(api): add OpenAPI specification generation

- Generate OpenAPI spec from entry router
- Add security scheme for bearer auth
- Document all endpoints and schemas
- Export spec for documentation

Related to DEV-23"
```

---

## Task 7: Final Verification and Integration

**Step 1: Run all type checks**

Run: `bun run check-types`

Expected: No type errors across all packages

**Step 2: Run all tests**

Run: `vitest run`

Expected: All tests pass

**Step 3: Run linting and formatting**

Run: `bun run fix`

Expected: All files formatted, no lint issues

**Step 4: Verify exports**

Run: `cat packages/api/src/index.ts`

Expected: All necessary exports present

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(api): complete entry CRUD API with mood extraction

- All type checks pass
- All tests pass (entry router + mood extraction)
- Linting and formatting complete
- OpenAPI spec generated
- Six endpoints implemented: create, list, get, update, delete, toggleBragWorthy
- Automatic mood extraction on create and update
- Comprehensive filtering and pagination
- Proper error handling with ORPCError

Closes DEV-23"
```

---

## Summary

**Deliverables:**
1. `packages/types/src/entry.ts` - Updated Entry types with TipTap and Zod schemas
2. `packages/api/src/middleware/auth.ts` - Authentication middleware
3. `packages/api/src/routers/entries.ts` - Full CRUD entry router (6 endpoints)
4. `packages/api/src/test-utils/context.ts` - Mock context helpers for testing
5. `packages/api/src/routers/__tests__/entries.test.ts` - Integration tests using ORPC `call()`
6. `packages/api/src/routers/__tests__/entries-mock.test.ts` - Mocking examples using `implement()`
7. `packages/api/src/openapi.ts` - OpenAPI specification

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /entries | Create entry with mood extraction |
| GET | /entries | List entries with filters |
| GET | /entries/:id | Get single entry |
| PUT | /entries/:id | Update entry (re-extracts moods if content changed) |
| DELETE | /entries/:id | Delete entry |
| PATCH | /entries/:id/flag | Toggle brag-worthy flag |

**Key Features:**
- Automatic mood extraction from TipTap JSON
- Dominant mood calculation
- Date range, mood, and brag-worthy filtering
- Pagination support
- User-scoped data (users can't access others' entries)
- Proper error handling (404, 401, 500)
- Type-safe with Zod validation
- Comprehensive test coverage

**Files Changed:**
- `packages/types/src/entry.ts` (modified)
- `packages/api/src/middleware/auth.ts` (new)
- `packages/api/src/routers/entries.ts` (new)
- `packages/api/src/test-utils/context.ts` (new)
- `packages/api/src/routers/__tests__/entries.test.ts` (new)
- `packages/api/src/routers/__tests__/entries-mock.test.ts` (new)
- `packages/api/src/openapi.ts` (new)
- `packages/api/src/index.ts` (modified)

**Performance Considerations:**
- Uses GIN index for mood array filtering
- Pagination with limit/offset
- Prepared statements via Drizzle ORM
- Selective mood re-extraction (only when content changes)

**Testing Strategy (ORPC Best Practices):**
- Use `call()` from `@orpc/server` to invoke procedures directly in tests
- Create mock context helpers to bypass Better-Auth middleware
- Test authorization: users cannot access other users' entries
- Integration tests with real database (Drizzle ORM)
- Mocking examples using `implement()` for frontend testing scenarios
- Filter verification tests (date range, mood, bragWorthy)
- Error handling tests (NOT_FOUND, authorization)
- Mood extraction verification on create and update

**Testing Resources:**
- ORPC Testing Docs: https://orpc.dev/docs/advanced/testing-mocking.md
- Use `call(procedure, input, { context })` for direct invocation
- Use `implement(procedure).handler(() => mockData)` for mocking