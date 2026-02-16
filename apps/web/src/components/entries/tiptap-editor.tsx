"use client";

import "./editor.css";

import { Toggle } from "@chrono/ui/components/toggle";
import type { TipTapDoc } from "@chrono/types/entry";
import { Bold, Italic, Strikethrough } from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { MoodBlock } from "./extensions/mood-block";

interface TipTapEditorProps {
	content: TipTapDoc;
	onChange: (content: TipTapDoc) => void;
	placeholder?: string;
	onSubmit?: () => void;
	editable?: boolean;
}

export function TipTapEditor({
	content,
	onChange,
	placeholder = "What's on your mind?",
	onSubmit,
	editable = true,
}: TipTapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false,
				blockquote: false,
				codeBlock: false,
				horizontalRule: false,
			}),
			Placeholder.configure({ placeholder }),
			MoodBlock,
		],
		content,
		editable,
		immediatelyRender: false,
		onUpdate: ({ editor: currentEditor }) => {
			onChange(currentEditor.getJSON() as TipTapDoc);
		},
		editorProps: {
			attributes: {
				role: "textbox",
				"aria-label": "Journal entry content",
				"aria-multiline": "true",
				class: "tiptap",
			},
			handleKeyDown: (_view, event) => {
				if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
					event.preventDefault();
					onSubmit?.();
					return true;
				}
				return false;
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="chrono-editor rounded-md border border-input bg-background p-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
			<EditorContent editor={editor} />

			{editable && (
				<BubbleMenu editor={editor}>
					<div className="flex items-center gap-0.5 rounded-md border border-border bg-popover p-1 shadow-md">
						<Toggle
							size="sm"
							pressed={editor.isActive("bold")}
							onPressedChange={() =>
								editor.chain().focus().toggleBold().run()
							}
							aria-label="Bold"
						>
							<Bold className="h-4 w-4" />
						</Toggle>
						<Toggle
							size="sm"
							pressed={editor.isActive("italic")}
							onPressedChange={() =>
								editor.chain().focus().toggleItalic().run()
							}
							aria-label="Italic"
						>
							<Italic className="h-4 w-4" />
						</Toggle>
						<Toggle
							size="sm"
							pressed={editor.isActive("strike")}
							onPressedChange={() =>
								editor.chain().focus().toggleStrike().run()
							}
							aria-label="Strikethrough"
						>
							<Strikethrough className="h-4 w-4" />
						</Toggle>
					</div>
				</BubbleMenu>
			)}
		</div>
	);
}
