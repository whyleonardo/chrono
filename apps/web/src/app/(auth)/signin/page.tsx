import { requireGuest } from "@/lib/auth-guard";
import { SignInForm } from "./_components/signin-form";

export default async function SignInPage() {
	await requireGuest();

	return <SignInForm />;
}
