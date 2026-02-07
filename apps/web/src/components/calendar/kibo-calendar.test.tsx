import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { KiboCalendar } from "./kibo-calendar";
import type { CalendarEntryItem } from "./types";

describe("KiboCalendar", () => {
	const mockEntries: CalendarEntryItem[] = [
		{
			id: "1",
			name: "Entry 1",
			date: "2026-02-04",
			mood: "flow",
			count: 1,
			status: "success",
		},
	];

	beforeEach(() => {
		cleanup();
	});

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

		// Get all weekday labels and check the first one
		const weekdayLabels = screen.getAllByText("Sun");
		expect(weekdayLabels.length).toBeGreaterThan(0);
		expect(screen.getAllByText("Mon").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Tue").length).toBeGreaterThan(0);
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

		// Click on a day button - look for buttons that contain just a day number
		const dayButtons = screen.getAllByRole("button");
		// Find a button that contains just a number (the day cell)
		const dayCell = dayButtons.find((btn) => {
			const text = btn.textContent?.trim();
			// Day cells have a number followed by optional content
			return text && /^\d+/.test(text);
		});

		if (dayCell) {
			fireEvent.click(dayCell);
			expect(onSelectDate).toHaveBeenCalled();
		} else {
			throw new Error("Could not find a day cell to click");
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

		const prevButtons = screen.getAllByLabelText(/previous month/i);
		expect(prevButtons.length).toBeGreaterThan(0);
		fireEvent.click(prevButtons[0]);
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
		const logEntries = screen.getAllByText(/1\s+log/);
		expect(logEntries.length).toBeGreaterThan(0);
	});
});
