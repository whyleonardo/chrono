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

export const moodEnum = pgEnum("mood", [
	"flow",
	"buggy",
	"learning",
	"meetings",
	"standard",
]);

export const entries = pgTable(
	"entries",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		date: date("date").notNull(),
		title: text("title"),
		content: jsonb("content").notNull(),
		moods: moodEnum("moods").array().notNull(),
		dominantMood: moodEnum("dominant_mood"),
		isBragWorthy: boolean("is_brag_worthy").default(false).notNull(),
		aiFeedback: text("ai_feedback"),
		aiSuggestedBullets: jsonb("ai_suggested_bullets"),
		aiBragWorthySuggestion: jsonb("ai_brag_worthy_suggestion"),
		aiAnalyzedAt: timestamp("ai_analyzed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("entries_user_date_idx").on(table.userId, table.date),
		index("entries_user_brag_idx").on(table.userId, table.isBragWorthy),
		index("entries_user_mood_idx").on(table.userId, table.dominantMood),
		index("entries_moods_gin_idx").using("gin", table.moods),
	]
);

export const entriesRelations = relations(entries, ({ one }) => ({
	user: one(user, {
		fields: [entries.userId],
		references: [user.id],
	}),
}));
