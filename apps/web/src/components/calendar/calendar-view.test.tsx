import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalendarView } from "./calendar-view";

const februaryHeading = /february/i;

describe("CalendarView", () => {
	it("renders month header and weekday labels", () => {
		render(<CalendarView />);
		expect(
			screen.getByRole("heading", { name: februaryHeading })
		).toBeInTheDocument();
		expect(screen.getByText("Sun")).toBeInTheDocument();
		expect(screen.getByText("Mon")).toBeInTheDocument();
	});
});
