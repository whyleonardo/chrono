import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DayCell } from "./day-cell";
import type { CalendarEntryItem } from "./types";

const LOG_COUNT_REGEX = /1\s+log/;
const BORDER_BLUE_REGEX = /border-blue/;
const BORDER_NEUTRAL_REGEX = /border-neutral-500/;

describe("DayCell", () => {
	afterEach(() => {
		cleanup();
	});
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

		expect(screen.getByText(LOG_COUNT_REGEX)).toBeInTheDocument();
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

		expect(container.querySelector("button")?.className).toMatch(
			BORDER_BLUE_REGEX
		);
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

		expect(container.querySelector("button")?.className).toMatch(
			BORDER_NEUTRAL_REGEX
		);
	});
});
