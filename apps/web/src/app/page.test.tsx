import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

const monthHeadingMatcher = /february/i;

describe("Home", () => {
	it("renders the calendar prototype", () => {
		render(<Home />);
		expect(
			screen.getByRole("heading", { name: monthHeadingMatcher })
		).toBeInTheDocument();
	});
});
