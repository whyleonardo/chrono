import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TipTapEditor } from "./tiptap-editor";

const journalEntryLabel = /journal entry/i;
const noop = (): void => undefined;

describe("TipTapEditor", () => {
	it("renders the editor element", async () => {
		render(<TipTapEditor content={{ type: "doc", content: [] }} onChange={noop} />);

		const editors = await screen.findAllByRole("textbox", {
			name: journalEntryLabel,
		});
		expect(editors.length).toBeGreaterThan(0);
	});

	it("renders with the chrono-editor wrapper class", async () => {
		const { container } = render(
			<TipTapEditor content={{ type: "doc", content: [] }} onChange={noop} />,
		);

		await screen.findAllByRole("textbox", { name: journalEntryLabel });
		expect(container.querySelector(".chrono-editor")).toBeInTheDocument();
	});

	it("accepts a custom placeholder", async () => {
		render(
			<TipTapEditor
				content={{ type: "doc", content: [] }}
				onChange={noop}
				placeholder="Write your thoughts..."
			/>,
		);

		const editors = await screen.findAllByRole("textbox", {
			name: journalEntryLabel,
		});
		expect(editors.length).toBeGreaterThan(0);
	});
});
