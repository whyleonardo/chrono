import { describe, expect, it } from "vitest";
import { getEntrySummaryByDate, mockEntries } from "./calendar-data";

describe("calendar-data", () => {
	it("returns a summary for dates with entries", () => {
		const summary = getEntrySummaryByDate("2026-02-04");
		expect(summary?.count).toBeGreaterThan(0);
		expect(summary?.mood).toBeDefined();
	});

	it("returns undefined for dates without entries", () => {
		const summary = getEntrySummaryByDate("2026-02-06");
		expect(summary).toBeUndefined();
	});

	it("exposes a stable mock entry set", () => {
		expect(mockEntries.length).toBeGreaterThan(0);
	});
});
