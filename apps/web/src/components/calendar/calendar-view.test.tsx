import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CalendarView } from "./calendar-view";

const februaryHeading = /february/i;
const darkSurfaceClass = /bg-neutral-950/;
const previousMonthLabel = /previous month/i;
const januaryPattern = /January/i;
const todayPattern = /today/i;
const digitPattern = /^\d+$/;

describe("CalendarView", () => {
	afterEach(() => {
		cleanup();
	});

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
			btn.textContent?.match(digitPattern)
		);

		if (dayCell) {
			fireEvent.click(dayCell);
			// Dialog should open with some content
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		}
	});

	it("navigates to previous month when clicking left arrow", () => {
		render(<CalendarView />);

		const prevButton = screen.getByLabelText(previousMonthLabel);
		fireEvent.click(prevButton);

		// Should show January 2026 (since default is Feb 2026)
		expect(screen.getByText(januaryPattern)).toBeInTheDocument();
	});

	it("navigates to today when clicking Today button", () => {
		render(<CalendarView />);

		const todayButton = screen.getByRole("button", { name: todayPattern });
		fireEvent.click(todayButton);

		// Should show current month
		const currentMonth = new Date().toLocaleString("default", {
			month: "long",
		});
		expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
	});
});
