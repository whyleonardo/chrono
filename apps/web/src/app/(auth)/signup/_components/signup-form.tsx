"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export function SignUpForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (!name.trim()) {
			setError("Name is required");
			return;
		}

		setIsLoading(true);

		await signUp.email({
			email,
			password,
			name,
			callbackURL: "/dashboard",
		});

		setIsLoading(false);
	};

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="w-full max-w-sm"
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.6, delay: 0.3 }}
		>
			{/* Mobile Logo */}
			<motion.div
				animate={{ opacity: 1 }}
				className="absolute top-8 left-8 lg:hidden"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			>
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
			</motion.div>

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

			{/* Error Message */}
			{error && (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-600 text-sm dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
					initial={{ opacity: 0, y: -10 }}
				>
					{error}
				</motion.div>
			)}

			{/* Email Form */}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label
						className="mb-2 block text-muted-foreground text-sm"
						htmlFor="name"
					>
						Name
					</label>
					<input
						className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
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
					<input
						className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						required
						type="email"
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
					<input
						className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						required
						type="password"
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
					<input
						className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
						id="confirmPassword"
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="••••••••"
						required
						type="password"
						value={confirmPassword}
					/>
				</div>

				<motion.button
					className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary font-medium text-primary-foreground transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
					disabled={isLoading}
					type="submit"
					whileHover={{ scale: 1.01 }}
					whileTap={{ scale: 0.99 }}
				>
					{isLoading ? (
						<motion.div
							animate={{ rotate: 360 }}
							className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
							transition={{
								duration: 1,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
					) : (
						<span>Create Account</span>
					)}
				</motion.button>
			</form>

			{/* Sign In Link */}
			<motion.div
				animate={{ opacity: 1 }}
				className="mt-6 text-center"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<p className="text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link
						className="text-foreground underline transition-colors hover:text-primary"
						href="/signin"
					>
						Sign in
					</Link>
				</p>
			</motion.div>

			{/* Footer */}
			<motion.p
				animate={{ opacity: 1 }}
				className="absolute right-0 bottom-8 left-0 px-6 text-center text-muted-foreground text-xs"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5, delay: 0.6 }}
			>
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
			</motion.p>
		</motion.div>
	);
}
