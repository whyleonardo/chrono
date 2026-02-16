"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@chrono/ui/components/dialog";
import { Button } from "@chrono/ui/components/button";
import type { Mood } from "@chrono/types/mood";
import { useState } from "react";
import { CreateEntryDialog } from "@/components/entries/create-entry-dialog";

interface DayDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dateLabel: string;
	entryCount: number;
	mood: Mood;
	date: string;
}

export function DayDetailDialog({
	open,
	onOpenChange,
	dateLabel,
	entryCount,
	mood,
	date,
}: DayDetailDialogProps) {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	return (
		<>
			<Dialog onOpenChange={onOpenChange} open={open}>
				<DialogContent className="max-w-md bg-neutral-950 text-neutral-50">
					<DialogHeader>
						<DialogTitle className="text-sm uppercase tracking-[0.3em]">
							{dateLabel}
						</DialogTitle>
					</DialogHeader>
					<div className="mt-2 text-xs text-neutral-400">
						{entryCount} {entryCount === 1 ? "entry" : "entries"} · {mood}
					</div>
					<div className="mt-4 flex justify-end">
						<Button
							size="sm"
							variant="outline"
							onClick={() => setCreateDialogOpen(true)}
							type="button"
						>
							Add Entry
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<CreateEntryDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				date={date}
				onSuccess={() => {
					onOpenChange(false);
				}}
			/>
		</>
	);
}
