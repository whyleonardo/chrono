"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import type { DayCellProps } from "./types";

export function DayCell({
	date,
	entries,
	isSelected,
	isToday,
	isDisabled,
	onSelect,
}: DayCellProps) {
	const entryCount = entries.length;
	const hasEntries = entryCount > 0;

	const buttonClassName = useMemo(() => {
		const baseClasses =
			"relative flex w-full flex-col justify-between rounded-xl border bg-neutral-950/40 p-2 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 aspect-square";

		if (isDisabled) {
			return `${baseClasses} border-neutral-800/50 text-neutral-600 cursor-not-allowed opacity-50`;
		}

		if (isSelected) {
			return `${baseClasses} border-blue-500/80 bg-blue-950/40 text-blue-200 hover:border-neutral-600 hover:bg-neutral-900`;
		}

		if (isToday) {
			return `${baseClasses} border-neutral-500/80 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800`;
		}

		return `${baseClasses} border-neutral-800 text-neutral-200 hover:border-neutral-600 hover:bg-neutral-900`;
	}, [isSelected, isToday, isDisabled]);

	return (
		<button
			className={buttonClassName}
			disabled={isDisabled}
			onClick={() => !isDisabled && onSelect(date)}
			type="button"
		>
			<div className="flex h-full flex-col justify-between">
				<div className="text-base text-neutral-200">{format(date, "d")}</div>
				{hasEntries ? (
					<div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-400">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
						<span>
							{entryCount} {entryCount === 1 ? "log" : "logs"}
						</span>
					</div>
				) : null}
			</div>
		</button>
	);
}
