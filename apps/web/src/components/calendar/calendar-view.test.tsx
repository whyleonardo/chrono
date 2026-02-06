import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
