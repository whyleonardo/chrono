"use client";

import { Button } from "@chrono/ui/components/button";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { groupEntriesByDate } from "./calendar-adapter";
import { DayCell } from "./day-cell";
import type { CalendarEntryItem } from "./types";

interface KiboCalendarProps {
	/** Entries to display on the calendar */
	entries: CalendarEntryItem[];
	/** Currently displayed month */
	month: Date;
	/** Callback when month changes */
	onMonthChange: (date: Date) => void;
	/** Callback when a date is selected */
	onSelectDate: (date: Date) => void;
	/** Currently selected date (optional) */
	selectedDate?: Date;
}

const weekdayLabels = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
] as const;

export function KiboCalendar({
	entries,
	month,
	onMonthChange,
	onSelectDate,
	selectedDate,
}: KiboCalendarProps) {
	const [internalSelectedDate, setInternalSelectedDate] = useState<
		Date | undefined
	>(selectedDate);

	const selected = selectedDate ?? internalSelectedDate;

	// Group entries by date for efficient lookup
	const entriesByDate = useMemo(() => groupEntriesByDate(entries), [entries]);

	// Generate days for the current month view only
	const days = useMemo(() => {
		const year = month.getFullYear();
		const monthIndex = month.getMonth();

		// Get last day of month
		const lastDay = new Date(year, monthIndex + 1, 0);

		const days: Date[] = [];

		// Add all days of current month only
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, monthIndex, i));
		}

		return days;
	}, [month]);

	const handlePrevMonth = () => {
		onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1));
	};

	const handleToday = () => {
		const today = new Date();
		onMonthChange(today);
	};

	const handleSelectDate = (date: Date) => {
		setInternalSelectedDate(date);
		onSelectDate(date);
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const isSelected = (date: Date) => {
		if (!selected) {
			return false;
		}
		return (
			date.getDate() === selected.getDate() &&
			date.getMonth() === selected.getMonth() &&
			date.getFullYear() === selected.getFullYear()
		);
	};

	const isFutureDate = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date > today;
	};

	const isFutureMonth = () => {
		const today = new Date();
		return (
			month.getFullYear() > today.getFullYear() ||
			(month.getFullYear() === today.getFullYear() &&
				month.getMonth() > today.getMonth())
		);
	};

	const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

	return (
		<section className="relative flex h-screen w-full flex-col gap-4 overflow-hidden bg-neutral-950 text-neutral-50">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-60"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_55%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_45%)]" />
			</div>

			<header className="flex flex-shrink-0 items-center justify-between px-6 pt-4">
				<div>
					<h2 className="font-semibold text-[28px] tracking-tight">
						{format(month, "MMMM")}
					</h2>
					<div className="text-neutral-500 text-sm uppercase tracking-[0.3em]">
						{format(month, "yyyy")}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						aria-label="Previous month"
						onClick={handlePrevMonth}
						size="icon-sm"
						variant="ghost"
					>
						<ChevronLeftIcon />
					</Button>
					<Button
						aria-label="Next month"
						disabled={isFutureMonth()}
						onClick={handleNextMonth}
						size="icon-sm"
						variant="ghost"
					>
						<ChevronRightIcon />
					</Button>
					<Button onClick={handleToday} size="sm" variant="outline">
						Today
					</Button>
				</div>
			</header>

			<div className="grid flex-shrink-0 grid-cols-7 gap-2 px-6 text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
				{weekdayLabels.map((label) => (
					<div className="text-center" key={label}>
						{label}
					</div>
				))}
			</div>

			<div className="min-h-0 flex-1 px-6 pb-4">
				<div className="grid h-full auto-rows-fr grid-cols-7 content-center gap-8">
					{days.map((date) => {
						const dateKey = getDateKey(date);
						const dateEntries = entriesByDate[dateKey] ?? [];
						const dateIsToday = isToday(date);
						const dateIsSelected = isSelected(date);
						const dateIsDisabled = isFutureDate(date);

						return (
							<div
								className="flex h-full w-full items-center justify-center"
								key={dateKey}
							>
								<DayCell
									date={date}
									entries={dateEntries}
									isDisabled={dateIsDisabled}
									isSelected={dateIsSelected}
									isToday={dateIsToday}
									onSelect={handleSelectDate}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
