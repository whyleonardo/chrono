"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { getEntrySummaryByDate } from "./calendar-data";
import { DayDetailDialog } from "./day-detail-dialog";
import { KiboCalendar } from "./kibo-calendar";
import type { CalendarEntryItem } from "./types";

// Mock calendar entries for February 2026
const mockCalendarEntries: CalendarEntryItem[] = [
	{
		id: "1",
		date: "2026-02-01",
		count: 1,
		mood: "standard",
		name: "Entry 1",
		status: "default",
	},
	{
		id: "2",
		date: "2026-02-02",
		count: 2,
		mood: "learning",
		name: "Entry 2",
		status: "primary",
	},
	{
		id: "3",
		date: "2026-02-03",
		count: 1,
		mood: "flow",
		name: "Entry 3",
		status: "default",
	},
	{
		id: "4",
		date: "2026-02-04",
		count: 3,
		mood: "flow",
		name: "Entry 4",
		status: "success",
	},
];

export function CalendarView() {
	const [month, setMonth] = useState(new Date(2026, 1, 1));
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	const entrySummary = useMemo(() => {
		if (!selectedDate) {
			return undefined;
		}

		return getEntrySummaryByDate(format(selectedDate, "yyyy-MM-dd"));
	}, [selectedDate]);

	const handleSelectDate = (date: Date) => {
		setSelectedDate(date);
	};

	const handleMonthChange = (newMonth: Date) => {
		setMonth(newMonth);
	};

	return (
		<>
			<KiboCalendar
				entries={mockCalendarEntries}
				month={month}
				onMonthChange={handleMonthChange}
				onSelectDate={handleSelectDate}
				selectedDate={selectedDate}
			/>

			<DayDetailDialog
				dateLabel={selectedDate ? format(selectedDate, "EEE, MMM d") : ""}
				entryCount={entrySummary?.count ?? 0}
				mood={entrySummary?.mood ?? "standard"}
				date={selectedDate ? selectedDate.toISOString() : new Date().toISOString()}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedDate(undefined);
					}
				}}
				open={Boolean(selectedDate)}
			/>
		</>
	);
}
