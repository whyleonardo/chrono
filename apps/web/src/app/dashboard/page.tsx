import { CalendarView } from "@/components/calendar/calendar-view";
import { requireAuth } from "@/lib/auth-guard";

export default async function DashboardPage() {
	await requireAuth();

	return (
		<div className="h-screen w-full">
			<CalendarView />
		</div>
	);
}
