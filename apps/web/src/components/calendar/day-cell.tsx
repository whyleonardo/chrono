"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import type { DayCellProps } from "./types";

export function DayCell({
	date,
	entries,
	isSelected,
	isToday,
	onSelect,
}: DayCellProps) {
	const entryCount = entries.length;
	const hasEntries = entryCount > 0;

	const buttonClassName = useMemo(() => {
		const baseClasses =
			"relative flex h-full w-full flex-col rounded-xl border bg-neutral-950/40 p-3 text-left text-sm transition-colors duration-150 hover:border-neutral-600 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400";

		if (isSelected) {
			return `${baseClasses} border-blue-500/80 bg-blue-950/40 text-blue-200`;
		}

		if (isToday) {
			return `${baseClasses} border-neutral-500/80 bg-neutral-900`;
		}

		return `${baseClasses} border-neutral-800 text-neutral-200`;
	}, [isSelected, isToday]);

	return (
		<button
			className={buttonClassName}
			onClick={() => onSelect(date)}
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
