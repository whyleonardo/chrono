# Calendar View Prototype Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prototype the DEV-29 monthly calendar view on the Home page that matches the provided reference image and supports month navigation, today jump, indicators, and a day detail dialog.

**Architecture:** Keep `apps/web/src/app/page.tsx` as a Server Component that renders a dedicated Client Component `CalendarView` for interactivity. `CalendarView` uses `react-day-picker` for the grid and local mock data for entry indicators. A separate `DayDetailDialog` component handles day selection and display of entry summaries. Styling is composed with Tailwind classes and DayPicker `classNames` to match the visual reference.

**Tech Stack:** Next.js App Router, React 19, TailwindCSS v4, `react-day-picker`, `date-fns`, `@chrono/ui` Dialog/Button.

---

### Task 1: Add calendar mock data utilities

**Files:**
- Create: `apps/web/src/components/calendar/calendar-data.ts`
- Test: `apps/web/src/components/calendar/calendar-data.test.ts`

**Step 1: Write the failing test**

```tsx
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
```

**Step 2: Run test to verify it fails**

Run: `vitest run apps/web/src/components/calendar/calendar-data.test.ts`
Expected: FAIL with module not found or undefined exports.

**Step 3: Write minimal implementation**

```ts
export type EntrySummary = {
  date: string;
  count: number;
  mood: "calm" | "focused" | "low" | "joy" | "neutral";
};

export const mockEntries: EntrySummary[] = [
  { date: "2026-02-01", count: 1, mood: "neutral" },
  { date: "2026-02-02", count: 2, mood: "focused" },
  { date: "2026-02-03", count: 1, mood: "calm" },
  { date: "2026-02-04", count: 3, mood: "joy" },
];

const entryMap = new Map(mockEntries.map((entry) => [entry.date, entry]));

export function getEntrySummaryByDate(date: string) {
  return entryMap.get(date);
}
```

**Step 4: Run test to verify it passes**

Run: `vitest run apps/web/src/components/calendar/calendar-data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/calendar-data.ts apps/web/src/components/calendar/calendar-data.test.ts
git commit -m "feat: add calendar mock data utilities"
```

### Task 2: Build the calendar day detail dialog

**Files:**
- Create: `apps/web/src/components/calendar/day-detail-dialog.tsx`
- Test: `apps/web/src/components/calendar/day-detail-dialog.test.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DayDetailDialog } from "./day-detail-dialog";

describe("DayDetailDialog", () => {
  it("renders the selected date and entry count", () => {
    render(
      <DayDetailDialog
        open
        onOpenChange={() => {}}
        dateLabel="Wed, Feb 4"
        entryCount={3}
        mood="joy"
      />
    );

    expect(screen.getByText("Wed, Feb 4")).toBeInTheDocument();
    expect(screen.getByText("3 entries")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `vitest run apps/web/src/components/calendar/day-detail-dialog.test.tsx`
Expected: FAIL with module not found or undefined exports.

**Step 3: Write minimal implementation**

```tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@chrono/ui/components/dialog";

type DayDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  entryCount: number;
  mood: "calm" | "focused" | "low" | "joy" | "neutral";
};

export function DayDetailDialog({
  open,
  onOpenChange,
  dateLabel,
  entryCount,
  mood,
}: DayDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-neutral-950 text-neutral-50">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-[0.3em]">
            {dateLabel}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 text-xs text-neutral-400">
          {entryCount} {entryCount === 1 ? "entry" : "entries"} · {mood}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `vitest run apps/web/src/components/calendar/day-detail-dialog.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/day-detail-dialog.tsx apps/web/src/components/calendar/day-detail-dialog.test.tsx
git commit -m "feat: add calendar day detail dialog"
```

### Task 3: Create the calendar view UI with DayPicker

**Files:**
- Create: `apps/web/src/components/calendar/calendar-view.tsx`
- Test: `apps/web/src/components/calendar/calendar-view.test.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalendarView } from "./calendar-view";

describe("CalendarView", () => {
  it("renders month header and weekday labels", () => {
    render(<CalendarView />);
    expect(screen.getByRole("heading", { name: /february/i })).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `vitest run apps/web/src/components/calendar/calendar-view.test.tsx`
Expected: FAIL with module not found or undefined exports.

**Step 3: Write minimal implementation**

```tsx
"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";

import { Button } from "@chrono/ui/components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { getEntrySummaryByDate } from "./calendar-data";
import { DayDetailDialog } from "./day-detail-dialog";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function CalendarView() {
  const [month, setMonth] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const entrySummary = useMemo(() => {
    if (!selectedDate) return undefined;
    return getEntrySummaryByDate(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate]);

  return (
    <section className="relative flex h-full flex-col gap-6 bg-neutral-950 text-neutral-50">
      <header className="flex items-center justify-between px-6 pt-6">
        <div>
          <div className="text-[32px] font-semibold tracking-tight">{format(month, "MMMM")}</div>
          <div className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            {format(month, "yyyy")}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon-sm" variant="ghost" aria-label="Previous month" onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>
            <ChevronLeftIcon />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Next month" onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>
            <ChevronRightIcon />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMonth(new Date())}>
            Today
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-3 px-6 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
        {weekdayLabels.map((label) => (
          <div key={label} className="text-center">
            {label}
          </div>
        ))}
      </div>

      <div className="flex-1 px-6 pb-6">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate}
          onSelect={setSelectedDate}
          weekStartsOn={0}
          className="w-full"
          classNames={{
            months: "w-full",
            month: "w-full",
            table: "w-full border-separate border-spacing-3",
            head: "hidden",
            row: "",
            cell: "h-[120px] align-top",
            day: "relative flex h-full w-full flex-col rounded-xl border border-neutral-800 bg-neutral-950/40 p-3 text-left text-sm transition-all duration-150 hover:border-neutral-600 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
            day_today: "border-neutral-500/80 bg-neutral-900",
            day_selected: "border-blue-500/80 bg-blue-950/40 text-blue-200",
            day_outside: "opacity-40",
          }}
          components={{
            DayContent: ({ date }) => {
              const summary = getEntrySummaryByDate(format(date, "yyyy-MM-dd"));
              return (
                <div className="flex h-full flex-col justify-between">
                  <div className="text-base text-neutral-200">{format(date, "d")}</div>
                  {summary ? (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <span>{summary.count} log</span>
                    </div>
                  ) : null}
                </div>
              );
            },
          }}
        />
      </div>

      <DayDetailDialog
        open={Boolean(selectedDate)}
        onOpenChange={(open) => !open && setSelectedDate(undefined)}
        dateLabel={selectedDate ? format(selectedDate, "EEE, MMM d") : ""}
        entryCount={entrySummary?.count ?? 0}
        mood={entrySummary?.mood ?? "neutral"}
      />
    </section>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `vitest run apps/web/src/components/calendar/calendar-view.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/calendar-view.tsx apps/web/src/components/calendar/calendar-view.test.tsx
git commit -m "feat: add calendar view UI"
```

### Task 4: Wire the Home page to the prototype

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Test: `apps/web/src/app/page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the calendar prototype", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /february/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `vitest run apps/web/src/app/page.test.tsx`
Expected: FAIL with missing render or assertion failure.

**Step 3: Write minimal implementation**

```tsx
import { CalendarView } from "@/components/calendar/calendar-view";

export default function Home() {
  return <CalendarView />;
}
```

**Step 4: Run test to verify it passes**

Run: `vitest run apps/web/src/app/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/app/page.tsx apps/web/src/app/page.test.tsx
git commit -m "feat: render calendar prototype on home"
```

### Task 5: Visual polish to match the reference image

**Files:**
- Modify: `apps/web/src/components/calendar/calendar-view.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CalendarView } from "./calendar-view";

describe("CalendarView styles", () => {
  it("includes the dark surface and border styling", () => {
    const { container } = render(<CalendarView />);
    expect(container.querySelector("section")?.className).toMatch(/bg-neutral-950/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `vitest run apps/web/src/components/calendar/calendar-view.test.tsx`
Expected: FAIL if the class names are missing.

**Step 3: Write minimal implementation**

```tsx
// Add atmospheric background and motion-safe fades
<section className="relative flex h-full flex-col gap-6 bg-neutral-950 text-neutral-50">
  <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_45%)]" />
  </div>
  {/* existing content */}
</section>
```

**Step 4: Run test to verify it passes**

Run: `vitest run apps/web/src/components/calendar/calendar-view.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/calendar/calendar-view.tsx
git commit -m "feat: polish calendar prototype visuals"
```

### Task 6: Quality checks

**Files:**
- None

**Step 1: Run unit tests**

Run: `vitest run`
Expected: PASS

**Step 2: Run lint and format**

Run: `bun x ultracite check`
Expected: PASS

**Step 3: Commit if fixes were required**

```bash
git add .
git commit -m "chore: fix lint issues"
```

---

### Notes

- Match the reference image layout: top-left month/year, compact nav cluster, seven-column grid, card-like day cells with subtle borders, and a blue selection outline.
- Keep it in dark mode and use atmospheric gradients for depth.
- Use `@frontend-design` and `@baseline-ui` when implementing visual tweaks.
- Stick to direct imports (`@chrono/ui/components/button`, `@chrono/ui/components/dialog`).
