"use client";

import { AnimatedArrowButton } from "@chrono/ui/components/animated-arrow-button";
import { EmailInput } from "@chrono/ui/components/email-input";
import { Input } from "@chrono/ui/components/input";
import { PasswordInput } from "@chrono/ui/components/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

export function SignUpForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);

		try {
			await signUp.email({
				email,
				password,
				name,
				callbackURL: "/dashboard",
			});
			toast.success("Account created!", {
				description: "Redirecting to dashboard...",
			});
			router.push("/dashboard");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to create account"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-sm">
			{/* Mobile Logo */}
			<div className="absolute top-8 left-8 lg:hidden">
				<svg
					className="h-7 w-7 text-foreground"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
				>
					<title>Chrono Logo</title>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>

			{/* Header */}
			<div className="mb-10 text-center">
				<h1
					className="mb-2 font-medium text-2xl"
					style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
				>
					Create your account
				</h1>
				<p className="text-muted-foreground text-sm">
					Start your mindful journaling journey today
				</p>
			</div>

			{/* Email Form */}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label
						className="mb-2 block text-muted-foreground text-sm"
						htmlFor="name"
					>
						Name
					</label>
					<Input
						autoComplete="name"
						id="name"
						onChange={(e) => setName(e.target.value)}
						placeholder="Your name"
						required
						type="text"
						value={name}
					/>
				</div>

				<div>
					<label
						className="mb-2 block text-muted-foreground text-sm"
						htmlFor="email"
					>
						Email
					</label>
					<EmailInput
						autoComplete="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						required
						value={email}
					/>
				</div>

				<div>
					<label
						className="mb-2 block text-muted-foreground text-sm"
						htmlFor="password"
					>
						Password
					</label>
					<PasswordInput
						autoComplete="new-password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						required
						value={password}
					/>
				</div>

				<div>
					<label
						className="mb-2 block text-muted-foreground text-sm"
						htmlFor="confirmPassword"
					>
						Confirm Password
					</label>
					<PasswordInput
						autoComplete="new-password"
						id="confirmPassword"
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="••••••••"
						required
						value={confirmPassword}
					/>
				</div>

				<AnimatedArrowButton
					className="w-full"
					disabled={isLoading}
					type="submit"
				>
					{isLoading ? (
						<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
					) : (
						<span>Create Account</span>
					)}
				</AnimatedArrowButton>
			</form>

			{/* Sign In Link */}
			<div className="mt-6 text-center">
				<p className="text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link
						className="text-foreground underline transition-colors hover:text-primary"
						href="/signin"
					>
						Sign in
					</Link>
				</p>
			</div>

			{/* Footer */}
			<p className="absolute right-0 bottom-8 left-0 px-6 text-center text-muted-foreground text-xs">
				By signing up you agree to our{" "}
				<button
					className="text-foreground underline transition-colors hover:text-primary"
					type="button"
				>
					Terms of service
				</button>{" "}
				&{" "}
				<button
					className="text-foreground underline transition-colors hover:text-primary"
					type="button"
				>
					Privacy policy
				</button>
			</p>
		</div>
	);
}
