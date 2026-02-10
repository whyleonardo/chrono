import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DayDetailDialog } from "./day-detail-dialog";

const entryCountText = /3\s+entries/;
const noop = () => undefined;

describe("DayDetailDialog", () => {
	it("renders the selected date and entry count", () => {
		render(
			<DayDetailDialog
				dateLabel="Wed, Feb 4"
				entryCount={3}
				mood="joy"
				onOpenChange={noop}
				open
			/>
		);

		expect(screen.getByText("Wed, Feb 4")).toBeInTheDocument();
		expect(screen.getByText(entryCountText)).toBeInTheDocument();
	});
});
