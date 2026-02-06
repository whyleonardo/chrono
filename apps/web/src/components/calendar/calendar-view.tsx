"use client";

import { Button } from "@chrono/ui/components/button";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type {
	DayButtonProps,
	DayPickerProps,
	MonthCaptionProps,
	NavProps,
} from "react-day-picker";
import { DayPicker } from "react-day-picker";

import { getEntrySummaryByDate } from "./calendar-data";
import { DayDetailDialog } from "./day-detail-dialog";

const weekdayLabels = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
] as const;

const dayContentBaseClassName = "flex h-full flex-col justify-between";

const CalendarDayButton = (props: DayButtonProps) => {
	const { day, children: _children, ...buttonProps } = props;
	const summary = getEntrySummaryByDate(format(day.date, "yyyy-MM-dd"));

	return (
		<button {...buttonProps}>
			<div className={dayContentBaseClassName}>
				<div className="text-base text-neutral-200">
					{format(day.date, "d")}
				</div>
				{summary ? (
					<div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-400">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
						<span>{summary.count} log</span>
					</div>
				) : null}
			</div>
		</button>
	);
};

const CalendarMonthCaption = (_props: MonthCaptionProps) => (
	<span className="hidden" />
);
const CalendarNav = (_props: NavProps) => <div className="hidden" />;

export function CalendarView() {
	const [month, setMonth] = useState(new Date(2026, 1, 1));
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	const entrySummary = useMemo(() => {
		if (!selectedDate) {
			return undefined;
		}

		return getEntrySummaryByDate(format(selectedDate, "yyyy-MM-dd"));
	}, [selectedDate]);

	const dayPickerComponents = {
		DayButton: CalendarDayButton,
		MonthCaption: CalendarMonthCaption,
		Nav: CalendarNav,
	} as DayPickerProps["components"];

	return (
		<section className="relative flex h-full flex-col gap-6 bg-neutral-950 text-neutral-50">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-60"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_55%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_45%)]" />
			</div>
			<header className="flex items-center justify-between px-6 pt-6">
				<div>
					<h2 className="font-semibold text-[32px] tracking-tight">
						{format(month, "MMMM")}
					</h2>
					<div className="text-neutral-500 text-sm uppercase tracking-[0.3em]">
						{format(month, "yyyy")}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						aria-label="Previous month"
						onClick={() => {
							setMonth(
								(current) =>
									new Date(current.getFullYear(), current.getMonth() - 1, 1)
							);
						}}
						size="icon-sm"
						variant="ghost"
					>
						<ChevronLeftIcon />
					</Button>
					<Button
						aria-label="Next month"
						onClick={() => {
							setMonth(
								(current) =>
									new Date(current.getFullYear(), current.getMonth() + 1, 1)
							);
						}}
						size="icon-sm"
						variant="ghost"
					>
						<ChevronRightIcon />
					</Button>
					<Button
						onClick={() => {
							setMonth(new Date());
						}}
						size="sm"
						variant="outline"
					>
						Today
					</Button>
				</div>
			</header>

			<div className="grid grid-cols-7 gap-3 px-6 text-[10px] text-neutral-500 uppercase tracking-[0.3em]">
				{weekdayLabels.map((label) => (
					<div className="text-center" key={label}>
						{label}
					</div>
				))}
			</div>

			<div className="flex-1 px-6 pb-6">
				<DayPicker
					className="w-full"
					classNames={{
						months: "w-full",
						month: "w-full",
						table: "w-full border-separate border-spacing-3",
						head: "hidden",
						weekdays: "hidden",
						weekday: "hidden",
						row: "",
						cell: "h-[120px] align-top",
						day: "align-top",
						day_button:
							"relative flex h-full w-full flex-col rounded-xl border border-neutral-800 bg-neutral-950/40 p-3 text-left text-sm transition-colors duration-150 hover:border-neutral-600 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
						day_today:
							"[&>button]:border-neutral-500/80 [&>button]:bg-neutral-900",
						day_selected:
							"[&>button]:border-blue-500/80 [&>button]:bg-blue-950/40 [&>button]:text-blue-200",
						day_outside: "opacity-40",
					}}
					components={dayPickerComponents}
					hideNavigation
					hideWeekdays
					mode="single"
					month={month}
					onMonthChange={setMonth}
					onSelect={setSelectedDate}
					selected={selectedDate}
					weekStartsOn={0}
				/>
			</div>

			<DayDetailDialog
				dateLabel={selectedDate ? format(selectedDate, "EEE, MMM d") : ""}
				entryCount={entrySummary?.count ?? 0}
				mood={entrySummary?.mood ?? "neutral"}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedDate(undefined);
					}
				}}
				open={Boolean(selectedDate)}
			/>
		</section>
	);
}
