import { requireAuth } from "@/lib/auth-guard";

export default async function DashboardPage() {
	const session = await requireAuth();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Dashboard</h1>
			<p className="mt-4">Welcome, {session.user.name || session.user.email}</p>
		</div>
	);
}
