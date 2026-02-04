"use client";

import { AnimatedArrowButton } from "@chrono/ui/components/animated-arrow-button";
import { Button } from "@chrono/ui/components/button";
import { EmailInput } from "@chrono/ui/components/email-input";
import { PasswordInput } from "@chrono/ui/components/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

export function SignInForm() {
	const router = useRouter();
	const [showEmailForm, setShowEmailForm] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.ChangeEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await signIn.email({
				email,
				password,
				callbackURL: "/dashboard",
			});

			toast.success("Welcome back!", {
				description: "You have been signed in successfully",
			});
			router.push("/dashboard");
		} catch (err) {
			const error = err as Error;
			toast.error("Sign in failed", {
				description: error.message || "Please check your credentials",
			});
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
					Welcome back
				</h1>
				<p className="text-muted-foreground text-sm">
					Sign in to continue your journey
				</p>
			</div>

			{showEmailForm ? (
				<>
					{/* Back Button */}
					<Button
						className="mb-6 flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
						onClick={() => setShowEmailForm(false)}
						size="icon-xs"
						variant="ghost"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Back</title>
							<path
								d="M15 19l-7-7 7-7"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
							/>
						</svg>
						Back
					</Button>

					{/* Email Form */}
					<form className="space-y-4" onSubmit={handleSubmit}>
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
								autoComplete="current-password"
								id="password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								value={password}
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
								<span>Sign In</span>
							)}
						</AnimatedArrowButton>
					</form>
				</>
			) : (
				<>
					{/* Social Auth Buttons */}
					<div className="space-y-3">
						<Button
							className="flex w-full items-center justify-center gap-2 border border-border font-medium text-sm transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50"
							onClick={() =>
								signIn.social({
									provider: "google",
									callbackURL: "/dashboard",
								})
							}
							size="lg"
							variant="outline"
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24">
								<title>Google</title>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Continue with Google
						</Button>

						<Button
							className="flex w-full items-center justify-center gap-2 border border-border font-medium text-sm transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50"
							onClick={() =>
								signIn.social({
									provider: "github",
									callbackURL: "/dashboard",
								})
							}
							size="lg"
							variant="outline"
						>
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<title>GitHub</title>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							Continue with GitHub
						</Button>
					</div>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-border border-t" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-background px-2 text-muted-foreground">
								or
							</span>
						</div>
					</div>

					<Button
						className="w-full border border-border bg-secondary/50 font-medium text-sm transition-all duration-200 hover:border-primary/30 hover:bg-secondary"
						onClick={() => setShowEmailForm(true)}
						size="lg"
						variant="secondary"
					>
						Continue with Email
					</Button>
				</>
			)}

			{/* Sign Up Link */}
			<div className="mt-6 text-center">
				<p className="text-muted-foreground text-sm">
					Don't have an account?{" "}
					<Link
						className="text-foreground underline transition-colors hover:text-primary"
						href="/signup"
					>
						Sign up
					</Link>
				</p>
			</div>

			{/* Footer */}
			<p className="absolute right-0 bottom-8 left-0 px-6 text-center text-muted-foreground text-xs">
				By signing in you agree to our{" "}
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
