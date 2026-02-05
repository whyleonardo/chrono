"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@chrono/ui/components/dialog";

type DayDetailDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dateLabel: string;
	entryCount: number;
	mood: "calm" | "focused" | "low" | "joy" | "neutral";
};

export function DayDetailDialog({
	open,
	onOpenChange,
	dateLabel,
	entryCount,
	mood,
}: DayDetailDialogProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-w-md bg-neutral-950 text-neutral-50">
				<DialogHeader>
					<DialogTitle className="text-sm uppercase tracking-[0.3em]">
						{dateLabel}
					</DialogTitle>
				</DialogHeader>
				<div className="mt-2 text-neutral-400 text-xs">
					{entryCount} {entryCount === 1 ? "entry" : "entries"} · {mood}
				</div>
			</DialogContent>
		</Dialog>
	);
}
