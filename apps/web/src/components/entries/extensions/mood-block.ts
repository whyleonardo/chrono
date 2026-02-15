import { mergeAttributes, Node } from "@tiptap/core";
import { MoodLabels } from "@chrono/types/mood";
import type { Mood } from "@chrono/types/mood";

export interface MoodBlockAttributes {
	mood: string;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		moodBlock: {
			/**
			 * Insert a mood block node at the current cursor position.
			 * The mood value must be one of: flow, buggy, learning, meetings, standard.
			 */
			insertMoodBlock: (attributes: MoodBlockAttributes) => ReturnType;
		};
	}
}

export const MoodBlock = Node.create({
	name: "moodBlock",
	group: "block",
	atom: true,

	addAttributes() {
		return {
			mood: {
				default: "standard",
				parseHTML: (element: HTMLElement) => element.getAttribute("data-mood"),
				renderHTML: (attributes: Record<string, unknown>) => ({
					"data-mood": attributes.mood,
				}),
			},
		};
	},

	parseHTML() {
		return [{ tag: "div[data-type=\"mood-block\"]" }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(
				{ "data-type": "mood-block", class: "mood-block" },
				HTMLAttributes,
			),
		];
	},

	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement("span");
			dom.classList.add("mood-block");
			dom.setAttribute("data-type", "mood-block");
			dom.setAttribute("data-mood", String(node.attrs.mood));

			const mood = node.attrs.mood as Mood;
			dom.textContent = MoodLabels[mood] ?? String(mood);

			return { dom };
		};
	},

	addCommands() {
		return {
			insertMoodBlock:
				(attributes) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: attributes,
					});
				},
		};
	},
});
