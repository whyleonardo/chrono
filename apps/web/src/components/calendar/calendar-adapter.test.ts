import type { Mood } from "@chrono/types/mood";
import { describe, expect, it } from "vitest";
import {
	adaptEntryToCalendarItem,
	getDateSummary,
	groupEntriesByDate,
} from "./calendar-adapter";
import type { CalendarEntryItem } from "./types";

describe("calendar-adapter", () => {
	describe("adaptEntryToCalendarItem", () => {
		it("converts entry summary to calendar item", () => {
			const entry = {
				id: "entry-1",
				date: "2026-02-04",
				count: 3,
				mood: "flow" as Mood,
				title: "Great day at work",
			};

			const result = adaptEntryToCalendarItem(entry);

			expect(result.id).toBe("entry-1");
			expect(result.date).toBe("2026-02-04");
			expect(result.count).toBe(3);
			expect(result.mood).toBe("flow");
			expect(result.status).toBeDefined();
		});

		it("maps mood to correct status", () => {
			const testCases = [
				{ mood: "flow" as Mood, expectedStatus: "success" },
				{ mood: "standard" as Mood, expectedStatus: "default" },
				{ mood: "learning" as Mood, expectedStatus: "primary" },
				{ mood: "buggy" as Mood, expectedStatus: "danger" },
				{ mood: "meetings" as Mood, expectedStatus: "warning" },
			];

			for (const { mood, expectedStatus } of testCases) {
				const entry = {
					id: "test",
					date: "2026-02-04",
					count: 1,
					mood,
					title: "Test",
				};
				const result = adaptEntryToCalendarItem(entry);
				expect(result.status).toBe(expectedStatus);
			}
		});
	});

	describe("groupEntriesByDate", () => {
		it("groups multiple entries by date", () => {
			const entries: CalendarEntryItem[] = [
				{
					id: "1",
					name: "Entry 1",
					date: "2026-02-04",
					mood: "flow",
					count: 1,
					status: "success",
				},
				{
					id: "2",
					name: "Entry 2",
					date: "2026-02-04",
					mood: "learning",
					count: 1,
					status: "primary",
				},
				{
					id: "3",
					name: "Entry 3",
					date: "2026-02-05",
					mood: "standard",
					count: 1,
					status: "default",
				},
			];

			const grouped = groupEntriesByDate(entries);

			expect(grouped["2026-02-04"]).toHaveLength(2);
			expect(grouped["2026-02-05"]).toHaveLength(1);
			expect(grouped["2026-02-06"]).toBeUndefined();
		});
	});

	describe("getDateSummary", () => {
		it("returns summary for date with entries", () => {
			const entries: CalendarEntryItem[] = [
				{
					id: "1",
					name: "Entry 1",
					date: "2026-02-04",
					mood: "flow",
					count: 1,
					status: "success",
				},
				{
					id: "2",
					name: "Entry 2",
					date: "2026-02-04",
					mood: "flow",
					count: 1,
					status: "success",
				},
			];

			const summary = getDateSummary("2026-02-04", entries);

			expect(summary).toBeDefined();
			expect(summary?.count).toBe(2);
			expect(summary?.dominantMood).toBe("flow");
		});

		it("returns undefined for date without entries", () => {
			const entries: CalendarEntryItem[] = [];
			const summary = getDateSummary("2026-02-04", entries);
			expect(summary).toBeUndefined();
		});
	});
});
