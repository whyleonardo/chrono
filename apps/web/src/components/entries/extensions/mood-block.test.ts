import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { describe, expect, it } from "vitest";
import { MoodBlock } from "./mood-block";

function createTestEditor(content?: Record<string, unknown>) {
	return new Editor({
		extensions: [StarterKit, MoodBlock],
		content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
	});
}

describe("MoodBlock extension", () => {
	it("has the correct extension name", () => {
		expect(MoodBlock.name).toBe("moodBlock");
	});

	it("registers with an editor without errors", () => {
		const editor = createTestEditor();
		expect(editor).toBeDefined();
		expect(editor.isDestroyed).toBe(false);
		editor.destroy();
	});

	it("inserts a mood block via the insertMoodBlock command", () => {
		const editor = createTestEditor();
		editor.commands.insertMoodBlock({ mood: "flow" });
		const json = editor.getJSON();

		const moodNode = json.content?.find(
			(node: Record<string, unknown>) => node.type === "moodBlock",
		);
		expect(moodNode).toBeDefined();
		expect(moodNode?.attrs?.mood).toBe("flow");
		editor.destroy();
	});

	it("defaults mood attribute to 'standard'", () => {
		const editor = createTestEditor({
			type: "doc",
			content: [{ type: "moodBlock" }],
		});
		const json = editor.getJSON();
		const moodNode = json.content?.find(
			(node: Record<string, unknown>) => node.type === "moodBlock",
		);
		expect(moodNode?.attrs?.mood).toBe("standard");
		editor.destroy();
	});

	it("produces JSON compatible with the server mood extractor", () => {
		const editor = createTestEditor({
			type: "doc",
			content: [
				{ type: "moodBlock", attrs: { mood: "flow" } },
				{ type: "moodBlock", attrs: { mood: "buggy" } },
			],
		});

		const json = editor.getJSON();
		const moodNodes =
			json.content?.filter(
				(node: Record<string, unknown>) => node.type === "moodBlock",
			) ?? [];

		expect(moodNodes).toHaveLength(2);
		expect(moodNodes.map((node) => node.attrs?.mood)).toEqual([
			"flow",
			"buggy",
		]);
		editor.destroy();
	});
});
