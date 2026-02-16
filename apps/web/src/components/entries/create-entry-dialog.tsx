"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@chrono/ui/components/dialog";
import { Button } from "@chrono/ui/components/button";
import { Input } from "@chrono/ui/components/input";
import type { TipTapDoc } from "@chrono/types/entry";
import { client } from "@/utils/orpc";
import { TipTapEditor } from "./tiptap-editor";

interface CreateEntryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	date: string;
	onSuccess?: () => void;
}

const emptyDoc: TipTapDoc = { type: "doc", content: [] };

export function CreateEntryDialog({
	open,
	onOpenChange,
	date,
	onSuccess,
}: CreateEntryDialogProps) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState<TipTapDoc>(emptyDoc);
	const queryClient = useQueryClient();

	const createEntry = useMutation({
		mutationFn: (input: { title?: string; content: TipTapDoc; date: string }) =>
			client.entries.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			toast.success("Entry created");
			setTitle("");
			setContent(emptyDoc);
			onOpenChange(false);
			onSuccess?.();
		},
		onError: () => {
			toast.error("Failed to create entry");
		},
	});

	const handleSubmit = () => {
		const isoDate = new Date(date).toISOString();
		createEntry.mutate({
			title: title.trim() || undefined,
			content,
			date: isoDate,
		});
	};

	const handleCancel = () => {
		onOpenChange(false);
	};

	const displayDate = format(new Date(date), "EEEE, MMMM d, yyyy");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>New Entry</DialogTitle>
					<DialogDescription>{displayDate}</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<Input
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Entry title (optional)"
					/>

					<TipTapEditor
						content={content}
						onChange={setContent}
						onSubmit={handleSubmit}
						placeholder="How was your day? Insert mood blocks with the /mood command..."
					/>

					<div className="flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							Cmd+Enter to save
						</span>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={handleCancel}
								type="button"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								disabled={createEntry.isPending}
								type="button"
							>
								{createEntry.isPending ? "Saving..." : "Save Entry"}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
