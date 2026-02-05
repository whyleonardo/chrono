import { requireGuest } from "@/lib/auth-guard";
import { SignUpForm } from "./_components/signup-form";

export default async function SignUpPage() {
	await requireGuest();

	return <SignUpForm />;
}
