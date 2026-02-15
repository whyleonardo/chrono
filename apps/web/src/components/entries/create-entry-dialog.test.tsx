import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateEntryDialog } from "./create-entry-dialog";

const entryTitleLabel = /entry title/i;
const saveEntryLabel = /save entry/i;
const cancelLabel = /cancel/i;

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	);
}

describe("CreateEntryDialog", () => {
	it("renders dialog content when open", () => {
		renderWithProviders(
			<CreateEntryDialog
				open={true}
				onOpenChange={() => undefined}
				date="2026-02-15T00:00:00.000Z"
			/>,
		);

		expect(screen.getByText("New Entry")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(entryTitleLabel),
		).toBeInTheDocument();
	});

	it("does not show content when closed", () => {
		const { container } = renderWithProviders(
			<CreateEntryDialog
				open={false}
				onOpenChange={() => undefined}
				date="2026-02-15T00:00:00.000Z"
			/>,
		);

		expect(container.querySelector("[data-slot='dialog-content']")).toBeNull();
	});

	it("has a save button", () => {
		renderWithProviders(
			<CreateEntryDialog
				open={true}
				onOpenChange={() => undefined}
				date="2026-02-15T00:00:00.000Z"
			/>,
		);

		expect(
			screen.getByRole("button", { name: saveEntryLabel }),
		).toBeInTheDocument();
	});

	it("has a cancel button that calls onOpenChange", () => {
		const handleOpenChange = vi.fn();
		renderWithProviders(
			<CreateEntryDialog
				open={true}
				onOpenChange={handleOpenChange}
				date="2026-02-15T00:00:00.000Z"
			/>,
		);

		screen.getByRole("button", { name: cancelLabel }).click();
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});
});
