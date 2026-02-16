import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DayDetailDialog } from "./day-detail-dialog";

const entryCountText = /3\s+entries/;
const noop = (): void => undefined;
const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	);
}

describe("DayDetailDialog", () => {
	it("renders the selected date and entry count", () => {
		renderWithProviders(
			<DayDetailDialog
				dateLabel="Wed, Feb 4"
				entryCount={3}
				mood="flow"
				date="2026-02-04T00:00:00.000Z"
				onOpenChange={noop}
				open
			/>,
		);

		expect(screen.getByText("Wed, Feb 4")).toBeInTheDocument();
		expect(screen.getByText(entryCountText)).toBeInTheDocument();
	});
});
