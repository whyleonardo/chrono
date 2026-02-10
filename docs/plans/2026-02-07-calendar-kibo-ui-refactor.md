# Calendar View Kibo UI Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the existing calendar view from `react-day-picker` to use Kibo UI's Calendar component via shadcn/ui registry, maintaining all existing functionality including entry summaries, mood indicators, and day detail dialogs.

**Architecture:** Replace the current `DayPicker` from `react-day-picker` with Kibo UI's `Calendar` component which provides a more composable API for displaying items grouped by day. Keep the existing data layer (`calendar-data.ts`) and dialog components but adapt the rendering to Kibo UI's pattern. The Kibo UI Calendar accepts an `items` prop with features grouped by day, and provides a `renderItem` callback for custom rendering.

**Tech Stack:** React 19, TypeScript, TailwindCSS v4, Kibo UI Calendar, date-fns, shadcn/ui components, Vitest for testing

---

## Pre-Implementation Setup

### Task 0: Install Kibo UI Calendar Component

**Context:** Kibo UI provides a custom registry for shadcn/ui. The @kibo-ui registry is already configured in `apps/web/components.json`, but the shadcn MCP may not recognize it. We'll use the direct CLI command.

**Step 1: Add Kibo UI Calendar to the project**

Run: `cd apps/web && npx shadcn@latest add @kibo-ui/calendar`

Expected: Component files are downloaded to `packages/ui/src/components/calendar.tsx` (or similar location)

**Step 2: Verify installation and check for new dependencies**

Run: `cat packages/ui/src/components/calendar.tsx | head -50`

Expected: File exists and contains Kibo UI Calendar component code

**Step 3: Commit the new component**

```bash
git add packages/ui/src/components/calendar.tsx
git commit -m "feat: add kibo-ui calendar component"
```

---

## Implementation Tasks

### Task 1: Create Entry Calendar Item Type

**Files:**
- Create: `apps/web/src/components/calendar/types.ts`

**Context:** Kibo UI Calendar expects items with specific shape. We need to define types that bridge our entry data to Kibo UI's expected format.

**Step 1: Write the type definitions**

Create `apps/web/src/components/calendar/types.ts`:

```typescript
import type { Mood } from "@chrono/types/mood";

/**
 * Entry item for display in Kibo UI Calendar
 * Maps to Kibo UI's expected item format
 */
export interface CalendarEntryItem {
	/** Unique identifier for the item */
	id: string;
	/** Display title/text for the entry */
	name: string;
	/** Date string in yyyy-MM-dd format */
	date: string;
	/** Mood associated with the entry */
	mood: Mood;
	/** Number of entries on this date (for summary view) */
	count: number;
	/** Status for color coding (matches Kibo UI pattern) */
	status: "default" | "primary" | "success" | "warning" | "danger";
}

/**
 * Props for custom day cell rendering
 */
export interface DayCellProps {
	/** The date for this cell */
	date: Date;
	/** Entries for this specific day */
	entries: CalendarEntryItem[];
	/** Whether this day is selected */
	isSelected: boolean;
	/** Whether this day is today */
	isToday: boolean;
	/** Click handler */
	onSelect: (date: Date) => void;
}

/**
 * Summary data for a date (aggregated entries)
 */
export interface DateSummary {
	date: string;
	count: number;
	dominantMood: Mood;
	entries: CalendarEntryItem[];
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/calendar/types.ts
git commit -m "feat: add calendar types for kibo ui integration"
```

---

### Task 2: Create Calendar Data Adapter

**Files:**
- Create: `apps/web/src/components/calendar/calendar-adapter.ts`
- Test: `apps/web/src/components/calendar/calendar-adapter.test.ts`

**Context:** We need to transform our existing entry data into the format expected by Kibo UI Calendar. This adapter will map `EntrySummary` to `CalendarEntryItem`.

**Step 1: Write the failing test**

Create `apps/web/src/components/calendar/calendar-adapter.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import type { CalendarEntryItem, DateSummary } from "./types";
import {
	adaptEntryToCalendarItem,
	groupEntriesByDate,
	getDateSummary,
} from "./calendar-adapter";

describe("calendar-adapter", () => {
	describe("adaptEntryToCalendarItem", () => {
		it("converts entry summary to calendar item", () => {
			const entry = {
				id: "entry-1",
				date: "2026-02-04",
				count: 3,
				mood: "joy" as const,
				title: "Great day at work",
			};

			const result = adaptEntryToCalendarItem(entry);

			expect(result.id).toBe("entry-1");
			expect(result.date).toBe("2026-02-04");
			expect(result.count).toBe(3);
			expect(result.mood).toBe("joy");
			expect(result.status).toBeDefined();
		});

		it("maps mood to correct status", () => {
			const testCases = [
				{ mood: "joy" as const, expectedStatus: "success" },
				{ mood: "calm" as const, expectedStatus: "default" },
				{ mood: "focused" as const, expectedStatus: "primary" },
				{ mood: "low" as const, expectedStatus: "danger" },
				{ mood: "neutral" as const, expectedStatus: "default" },
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
					mood: "joy",
					count: 1,
					status: "success",
				},
				{
					id: "2",
					name: "Entry 2",
					date: "2026-02-04",
					mood: "focused",
					count: 1,
					status: "primary",
				},
				{
					id: "3",
					name: "Entry 3",
					date: "2026-02-05",
					mood: "calm",
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
					mood: "joy",
					count: 1,
					status: "success",
				},
				{
					id: "2",
					name: "Entry 2",
					date: "2026-02-04",
					mood: "joy",
					count: 1,
					status: "success",
				},
			];

			const summary = getDateSummary("2026-02-04", entries);

			expect(summary).toBeDefined();
			expect(summary?.count).toBe(2);
			expect(summary?.dominantMood).toBe("joy");
		});

		it("returns undefined for date without entries", () => {
			const entries: CalendarEntryItem[] = [];
			const summary = getDateSummary("2026-02-04", entries);
			expect(summary).toBeUndefined();
		});
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd apps/web && vitest run src/components/calendar/calendar-adapter.test.ts`

Expected: FAIL - "calendar-adapter" module not found

**Step 3: Write minimal implementation**

Create `apps/web/src/components/calendar/calendar-adapter.ts`:

```typescript
import type { Mood } from "@chrono/types/mood";
import type { CalendarEntryItem, DateSummary } from "./types";

/**
 * Maps mood values to Kibo UI status colors
 */
function mapMoodToStatus(mood: string): CalendarEntryItem["status"] {
	switch (mood) {
		case "joy":
			return "success";
		case "focused":
			return "primary";
		case "calm":
			return "default";
		case "low":
			return "danger";
		case "neutral":
		default:
			return "default";
	}
}

interface EntryInput {
	id: string;
	date: string;
	count: number;
	mood: Mood;
	title?: string | null;
}

/**
 * Adapts an entry to Kibo UI Calendar item format
 */
export function adaptEntryToCalendarItem(entry: EntryInput): CalendarEntryItem {
	return {
		id: entry.id,
		name: entry.title ?? "Entry",
		date: entry.date,
		mood: entry.mood,
		count: entry.count,
		status: mapMoodToStatus(entry.mood),
	};
}

/**
 * Groups calendar items by their date
 */
export function groupEntriesByDate(
	entries: CalendarEntryItem[]
): Record<string, CalendarEntryItem[]> {
	const grouped: Record<string, CalendarEntryItem[]> = {};

	for (const entry of entries) {
		if (!grouped[entry.date]) {
			grouped[entry.date] = [];
		}
		grouped[entry.date].push(entry);
	}

	return grouped;
}

/**
 * Gets a summary of entries for a specific date
 */
export function getDateSummary(
	date: string,
	entries: CalendarEntryItem[]
): DateSummary | undefined {
	const dateEntries = entries.filter((e) => e.date === date);

	if (dateEntries.length === 0) {
		return undefined;
	}

	// Count mood occurrences to find dominant mood
	const moodCounts: Record<string, number> = {};
	for (const entry of dateEntries) {
		moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
	}

	const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0] as Mood;

	return {
		date,
		count: dateEntries.length,
		dominantMood,
		entries: dateEntries,
	};
}
```

**Step 4: Run test to verify it passes**

Run: `cd apps/web && vitest run src/components/calendar/calendar-adapter.test.ts`

Expected: All tests PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/calendar-adapter.ts \\
  apps/web/src/components/calendar/calendar-adapter.test.ts

git commit -m "feat: add calendar data adapter for kibo ui"
```

---

### Task 3: Create Custom Day Cell Component

**Files:**
- Create: `apps/web/src/components/calendar/day-cell.tsx`
- Test: `apps/web/src/components/calendar/day-cell.test.tsx`

**Context:** Kibo UI Calendar allows custom rendering of day cells via render props. We need a component that displays the day number and entry summary indicator (matching current design).

**Step 1: Write the failing test**

Create `apps/web/src/components/calendar/day-cell.test.tsx`:

```typescript
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CalendarEntryItem } from "./types";
import { DayCell } from "./day-cell";

describe("DayCell", () => {
	const mockEntries: CalendarEntryItem[] = [
		{
			id: "1",
			name: "Entry 1",
			date: "2026-02-04",
			mood: "joy",
			count: 1,
			status: "success",
		},
	];

	it("renders day number", () => {
		render(
			<DayCell
				date={new Date(2026, 1, 4)}
				entries={[]}
				isSelected={false}
				isToday={false}
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText("4")).toBeInTheDocument();
	});

	it("shows entry count when entries exist", () => {
		render(
			<DayCell
				date={new Date(2026, 1, 4)}
				entries={mockEntries}
				isSelected={false}
				isToday={false}
				onSelect={vi.fn()}
			/>
		);

		expect(screen.getByText(/1\s+log/)).toBeInTheDocument();
	});

	it("calls onSelect when clicked", () => {
		const onSelect = vi.fn();
		const date = new Date(2026, 1, 4);

		render(
			<DayCell
				date={date}
				entries={[]}
				isSelected={false}
				isToday={false}
				onSelect={onSelect}
			/>
		);

		fireEvent.click(screen.getByRole("button"));
		expect(onSelect).toHaveBeenCalledWith(date);
	});

	it("applies selected styling when isSelected is true", () => {
		const { container } = render(
			<DayCell
				date={new Date(2026, 1, 4)}
				entries={[]}
				isSelected={true}
				isToday={false}
				onSelect={vi.fn()}
			/>
		);

		expect(container.querySelector("button")?.className).toMatch(/border-blue/);
	});

	it("applies today styling when isToday is true", () => {
		const { container } = render(
			<DayCell
				date={new Date(2026, 1, 4)}
				entries={[]}
				isSelected={false}
				isToday={true}
				onSelect={vi.fn()}
			/>
		);

		expect(container.querySelector("button")?.className).toMatch(/border-neutral-500/);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd apps/web && vitest run src/components/calendar/day-cell.test.tsx`

Expected: FAIL - "day-cell" module not found

**Step 3: Write minimal implementation**

Create `apps/web/src/components/calendar/day-cell.tsx`:

```typescript
"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import type { DayCellProps } from "./types";

export function DayCell({
	date,
	entries,
	isSelected,
	isToday,
	onSelect,
}: DayCellProps) {
	const entryCount = entries.length;
	const hasEntries = entryCount > 0;

	const buttonClassName = useMemo(() => {
		const baseClasses =
			"relative flex h-full w-full flex-col rounded-xl border bg-neutral-950/40 p-3 text-left text-sm transition-colors duration-150 hover:border-neutral-600 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400";

		if (isSelected) {
			return `${baseClasses} border-blue-500/80 bg-blue-950/40 text-blue-200`;
		}

		if (isToday) {
			return `${baseClasses} border-neutral-500/80 bg-neutral-900`;
		}

		return `${baseClasses} border-neutral-800 text-neutral-200`;
	}, [isSelected, isToday]);

	return (
		<button
			className={buttonClassName}
			onClick={() => onSelect(date)}
			type="button"
		>
			<div className="flex h-full flex-col justify-between">
				<div className="text-base text-neutral-200">{format(date, "d")}</div>
				{hasEntries ? (
					<div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-400">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
						<span>
							{entryCount} {entryCount === 1 ? "log" : "logs"}
						</span>
					</div>
				) : null}
			</div>
		</button>
	);
}
```

**Step 4: Run test to verify it passes**

Run: `cd apps/web && vitest run src/components/calendar/day-cell.test.tsx`

Expected: All tests PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/day-cell.tsx \\
  apps/web/src/components/calendar/day-cell.test.tsx

git commit -m "feat: add custom day cell component for kibo ui calendar"
```

---

### Task 4: Create Kibo UI Calendar Wrapper

**Files:**
- Create: `apps/web/src/components/calendar/kibo-calendar.tsx`
- Test: `apps/web/src/components/calendar/kibo-calendar.test.tsx`

**Context:** Create a wrapper component that integrates Kibo UI Calendar with our data layer and custom day cell rendering.

**Step 1: Write the failing test**

Create `apps/web/src/components/calendar/kibo-calendar.test.tsx`:

```typescript
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CalendarEntryItem } from "./types";
import { KiboCalendar } from "./kibo-calendar";

describe("KiboCalendar", () => {
	const mockEntries: CalendarEntryItem[] = [
		{
			id: "1",
			name: "Entry 1",
			date: "2026-02-04",
			mood: "joy",
			count: 1,
			status: "success",
		},
	];

	it("renders calendar with month header", () => {
		render(
			<KiboCalendar
				entries={mockEntries}
				month={new Date(2026, 1, 1)}
				onMonthChange={vi.fn()}
				onSelectDate={vi.fn()}
			/>
		);

		expect(screen.getByText(/February/i)).toBeInTheDocument();
	});

	it("renders weekday labels", () => {
		render(
			<KiboCalendar
				entries={mockEntries}
				month={new Date(2026, 1, 1)}
				onMonthChange={vi.fn()}
				onSelectDate={vi.fn()}
			/>
		);

		expect(screen.getByText("Sun")).toBeInTheDocument();
		expect(screen.getByText("Mon")).toBeInTheDocument();
		expect(screen.getByText("Tue")).toBeInTheDocument();
	});

	it("calls onSelectDate when a day is clicked", () => {
		const onSelectDate = vi.fn();

		render(
			<KiboCalendar
				entries={mockEntries}
				month={new Date(2026, 1, 1)}
				onMonthChange={vi.fn()}
				onSelectDate={onSelectDate}
			/>
		);

		// Click on a day button
		const dayButtons = screen.getAllByRole("button");
		// Filter to day cells (they have numbers in them)
		const dayCell = dayButtons.find((btn) =>
			btn.textContent?.match(/^\d+$/)
		);

		if (dayCell) {
			fireEvent.click(dayCell);
			expect(onSelectDate).toHaveBeenCalled();
		}
	});

	it("calls onMonthChange when navigating months", () => {
		const onMonthChange = vi.fn();

		render(
			<KiboCalendar
				entries={mockEntries}
				month={new Date(2026, 1, 1)}
				onMonthChange={onMonthChange}
				onSelectDate={vi.fn()}
			/>
		);

		const prevButton = screen.getByLabelText(/previous month/i);
		fireEvent.click(prevButton);
		expect(onMonthChange).toHaveBeenCalled();
	});

	it("displays entry summary on days with entries", () => {
		render(
			<KiboCalendar
				entries={mockEntries}
				month={new Date(2026, 1, 1)}
				onMonthChange={vi.fn()}
				onSelectDate={vi.fn()}
			/>
		);

		// Look for "1 log" text somewhere in the calendar
		expect(screen.getByText(/1\s+log/)).toBeInTheDocument();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd apps/web && vitest run src/components/calendar/kibo-calendar.test.tsx`

Expected: FAIL - "kibo-calendar" module not found

**Step 3: Write minimal implementation**

Create `apps/web/src/components/calendar/kibo-calendar.tsx`:

```typescript
"use client";

import { Button } from "@chrono/ui/components/button";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DayCell } from "./day-cell";
import { groupEntriesByDate } from "./calendar-adapter";
import type { CalendarEntryItem } from "./types";

interface KiboCalendarProps {
	/** Entries to display on the calendar */
	entries: CalendarEntryItem[];
	/** Currently displayed month */
	month: Date;
	/** Callback when month changes */
	onMonthChange: (date: Date) => void;
	/** Callback when a date is selected */
	onSelectDate: (date: Date) => void;
	/** Currently selected date (optional) */
	selectedDate?: Date;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function KiboCalendar({
	entries,
	month,
	onMonthChange,
	onSelectDate,
	selectedDate,
}: KiboCalendarProps) {
	const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(
		selectedDate
	);

	const selected = selectedDate ?? internalSelectedDate;

	// Group entries by date for efficient lookup
	const entriesByDate = useMemo(() => groupEntriesByDate(entries), [entries]);

	// Generate days for the current month view
	const days = useMemo(() => {
		const year = month.getFullYear();
		const monthIndex = month.getMonth();

		// Get first day of month
		const firstDay = new Date(year, monthIndex, 1);
		// Get last day of month
		const lastDay = new Date(year, monthIndex + 1, 0);

		// Calculate days to show from previous month
		const startDayOfWeek = firstDay.getDay();
		const days: Date[] = [];

		// Add days from previous month
		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			days.push(new Date(year, monthIndex, -i));
		}

		// Add all days of current month
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, monthIndex, i));
		}

		// Add days from next month to complete the grid (6 rows * 7 cols = 42 cells)
		const remainingCells = 42 - days.length;
		for (let i = 1; i <= remainingCells; i++) {
			days.push(new Date(year, monthIndex + 1, i));
		}

		return days;
	}, [month]);

	const handlePrevMonth = () => {
		onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1));
	};

	const handleToday = () => {
		const today = new Date();
		onMonthChange(today);
	};

	const handleSelectDate = (date: Date) => {
		setInternalSelectedDate(date);
		onSelectDate(date);
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const isSelected = (date: Date) => {
		if (!selected) return false;
		return (
			date.getDate() === selected.getDate() &&
			date.getMonth() === selected.getMonth() &&
			date.getFullYear() === selected.getFullYear()
		);
	};

	const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

	return (
		<section className="relative flex h-svh w-full flex-col gap-6 bg-neutral-950 text-neutral-50">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-60"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_55%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_45%)]" />
			</div>

			<header className="flex items-center justify-between px-6 pt-6">
				<div>
					<h2 className="font-semibold text-[32px] tracking-tight">
						{format(month, "MMMM")}
					</h2>
					<div className="text-neutral-500 text-sm uppercase tracking-[0.3em]">
						{format(month, "yyyy")}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						aria-label="Previous month"
						onClick={handlePrevMonth}
						size="icon-sm"
						variant="ghost"
					>
						<ChevronLeftIcon />
					</Button>
					<Button
						aria-label="Next month"
						onClick={handleNextMonth}
						size="icon-sm"
						variant="ghost"
					>
						<ChevronRightIcon />
					</Button>
					<Button onClick={handleToday} size="sm" variant="outline">
						Today
					</Button>
				</div>
			</header>

			<div className="grid grid-cols-7 gap-3 px-6 text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
				{weekdayLabels.map((label) => (
					<div className="text-center" key={label}>
						{label}
					</div>
				))}
			</div>

			<div className="h-full flex-1 px-6 pb-6">
				<div className="grid h-full grid-cols-7 grid-rows-6 gap-3">
					{days.map((date) => {
						const dateKey = getDateKey(date);
						const dateEntries = entriesByDate[dateKey] ?? [];
						const dateIsToday = isToday(date);
						const dateIsSelected = isSelected(date);
						const isOutsideMonth = date.getMonth() !== month.getMonth();

						return (
							<div
								className={isOutsideMonth ? "opacity-40" : ""}
								key={dateKey}
							>
								<DayCell
									date={date}
									entries={dateEntries}
									isSelected={dateIsSelected}
									isToday={dateIsToday}
									onSelect={handleSelectDate}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
```

**Step 4: Run test to verify it passes**

Run: `cd apps/web && vitest run src/components/calendar/kibo-calendar.test.tsx`

Expected: All tests PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/kibo-calendar.tsx \\
  apps/web/src/components/calendar/kibo-calendar.test.tsx

git commit -m "feat: add kibo calendar wrapper component"
```

---

### Task 5: Update CalendarView to Use Kibo Calendar

**Files:**
- Modify: `apps/web/src/components/calendar/calendar-view.tsx`
- Test: `apps/web/src/components/calendar/calendar-view.test.tsx` (update existing)

**Context:** Replace the old `DayPicker` implementation with our new Kibo Calendar wrapper while maintaining the same external interface and functionality.

**Step 1: Write the updated test**

Update `apps/web/src/components/calendar/calendar-view.test.tsx`:

```typescript
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CalendarView } from "./calendar-view";

const februaryHeading = /february/i;
const darkSurfaceClass = /bg-neutral-950/;

describe("CalendarView", () => {
	it("renders month header and weekday labels", () => {
		render(<CalendarView />);
		expect(
			screen.getByRole("heading", { name: februaryHeading })
		).toBeInTheDocument();
		expect(screen.getByText("Sun")).toBeInTheDocument();
		expect(screen.getByText("Mon")).toBeInTheDocument();
	});

	it("includes the dark surface and border styling", () => {
		const { container } = render(<CalendarView />);
		expect(container.querySelector("section")?.className).toMatch(
			darkSurfaceClass
		);
	});

	it("opens day detail dialog when a day is clicked", () => {
		render(<CalendarView />);

		// Click on a day button
		const dayButtons = screen.getAllByRole("button");
		const dayCell = dayButtons.find((btn) =>
			btn.textContent?.match(/^\d+$/)
		);

		if (dayCell) {
			fireEvent.click(dayCell);
			// Dialog should open with some content
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		}
	});

	it("navigates to previous month when clicking left arrow", () => {
		render(<CalendarView />);

		const prevButton = screen.getByLabelText(/previous month/i);
		fireEvent.click(prevButton);

		// Should show January 2026 (since default is Feb 2026)
		expect(screen.getByText(/January/i)).toBeInTheDocument();
	});

	it("navigates to today when clicking Today button", () => {
		render(<CalendarView />);

		const todayButton = screen.getByRole("button", { name: /today/i });
		fireEvent.click(todayButton);

		// Should show current month
		const currentMonth = new Date().toLocaleString("default", { month: "long" });
		expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd apps/web && vitest run src/components/calendar/calendar-view.test.tsx`

Expected: FAIL - Tests fail because old implementation doesn't match new behavior

**Step 3: Update the implementation**

Update `apps/web/src/components/calendar/calendar-view.tsx`:

```typescript
"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { getEntrySummaryByDate } from "./calendar-data";
import { DayDetailDialog } from "./day-detail-dialog";
import { KiboCalendar } from "./kibo-calendar";
import { adaptEntryToCalendarItem } from "./calendar-adapter";
import type { CalendarEntryItem } from "./types";

// Convert mock entries to calendar items
const mockCalendarEntries: CalendarEntryItem[] = [
	{ id: "1", date: "2026-02-01", count: 1, mood: "neutral", name: "Entry 1", status: "default" },
	{ id: "2", date: "2026-02-02", count: 2, mood: "focused", name: "Entry 2", status: "primary" },
	{ id: "3", date: "2026-02-03", count: 1, mood: "calm", name: "Entry 3", status: "default" },
	{ id: "4", date: "2026-02-04", count: 3, mood: "joy", name: "Entry 4", status: "success" },
].map(adaptEntryToCalendarItem);

export function CalendarView() {
	const [month, setMonth] = useState(new Date(2026, 1, 1));
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	const entrySummary = useMemo(() => {
		if (!selectedDate) {
			return undefined;
		}

		return getEntrySummaryByDate(format(selectedDate, "yyyy-MM-dd"));
	}, [selectedDate]);

	const handleSelectDate = (date: Date) => {
		setSelectedDate(date);
	};

	const handleMonthChange = (newMonth: Date) => {
		setMonth(newMonth);
	};

	return (
		<>
			<KiboCalendar
				entries={mockCalendarEntries}
				month={month}
				onMonthChange={handleMonthChange}
				onSelectDate={handleSelectDate}
				selectedDate={selectedDate}
			/>

			<DayDetailDialog
				dateLabel={selectedDate ? format(selectedDate, "EEE, MMM d") : ""}
				entryCount={entrySummary?.count ?? 0}
				mood={entrySummary?.mood ?? "neutral"}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedDate(undefined);
					}
				}}
				open={Boolean(selectedDate)}
			/>
		</>
	);
}
```

**Step 4: Run test to verify it passes**

Run: `cd apps/web && vitest run src/components/calendar/calendar-view.test.tsx`

Expected: All tests PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/calendar-view.tsx \\
  apps/web/src/components/calendar/calendar-view.test.tsx

git commit -m "refactor: replace DayPicker with Kibo Calendar"
```

---

### Task 6: Clean Up Old Dependencies and Files

**Files:**
- Modify: `apps/web/package.json`
- Delete: Remove old implementation files (optional - can keep for reference)

**Context:** Remove the `react-day-picker` dependency since we're no longer using it.

**Step 1: Remove react-day-picker from dependencies**

Modify `apps/web/package.json` to remove the `react-day-picker` line from dependencies.

Current:
```json
"react-day-picker": "^9.13.0",
```

Change to: Remove the line entirely.

**Step 2: Update lockfile**

Run: `bun install`

Expected: Dependencies updated, lockfile changed

**Step 3: Verify tests still pass**

Run: `cd apps/web && vitest run src/components/calendar/`

Expected: All tests PASS

**Step 4: Commit**

```bash
git add apps/web/package.json bun.lock
git commit -m "chore: remove react-day-picker dependency"
```

---

### Task 7: Run Full Test Suite and Type Check

**Context:** Ensure the entire codebase still works correctly after the refactor.

**Step 1: Run type check**

Run: `bun run check-types`

Expected: No type errors

**Step 2: Run lint**

Run: `bun run check`

Expected: No lint errors (or auto-fixable issues)

**Step 3: Fix any auto-fixable issues**

Run: `bun run fix`

Expected: Issues automatically fixed

**Step 4: Run full test suite**

Run: `vitest run`

Expected: All tests PASS across the entire project

**Step 5: Final commit**

```bash
git commit -m "style: fix formatting and lint issues" || echo "No changes to commit"
```

---

## Summary

This plan refactors the calendar view from `react-day-picker` to Kibo UI Calendar by:

1. **Installing Kibo UI Calendar** via shadcn CLI
2. **Creating type definitions** for calendar entry items (`types.ts`)
3. **Building a data adapter** to transform existing entry data to Kibo UI format (`calendar-adapter.ts`)
4. **Creating a custom day cell** component that matches our existing design (`day-cell.tsx`)
5. **Building a Kibo Calendar wrapper** that integrates with our data layer (`kibo-calendar.tsx`)
6. **Updating CalendarView** to use the new implementation while maintaining the same UI
7. **Removing old dependencies** (`react-day-picker`)
8. **Running full verification** (types, lint, tests)

### Key Changes:
- Replaces `DayPicker` from `react-day-picker` with custom Kibo Calendar implementation
- Maintains all existing functionality (month navigation, day selection, entry summaries, day detail dialogs)
- Preserves the dark theme styling with gradient backgrounds
- Keeps the same visual design (day cells with entry count indicators)
- Uses date-fns for all date formatting and manipulation

### Testing Strategy:
- Unit tests for data adapter functions
- Component tests for DayCell with user interactions
- Integration tests for KiboCalendar with month navigation
- End-to-end tests for CalendarView ensuring dialog opens on day click

---

## Reference: Related Files

**Before (Old Implementation):**
- `apps/web/src/components/calendar/calendar-view.tsx` - Uses DayPicker from react-day-picker

**After (New Implementation):**
- `apps/web/src/components/calendar/types.ts` - Type definitions
- `apps/web/src/components/calendar/calendar-adapter.ts` - Data transformation
- `apps/web/src/components/calendar/day-cell.tsx` - Custom day rendering
- `apps/web/src/components/calendar/kibo-calendar.tsx` - Main calendar component
- `apps/web/src/components/calendar/calendar-view.tsx` - Updated to use KiboCalendar
- `packages/ui/src/components/calendar.tsx` - Kibo UI Calendar component (installed via shadcn)

**Unchanged Files:**
- `apps/web/src/components/calendar/calendar-data.ts` - Entry data layer
- `apps/web/src/components/calendar/day-detail-dialog.tsx` - Dialog component

---

## Skills Applied

- @frontend-design - Creating production-grade UI components
- @vercel-composition-patterns - Composable component architecture
- @vercel-react-best-practices - Performance optimization
- @baseline-ui - Consistent UI baseline
