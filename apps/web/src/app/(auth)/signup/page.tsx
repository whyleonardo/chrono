"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useState(() => {
		setIsLoaded(true);
	});

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
		<div className="flex min-h-screen w-full">
			{/* Left Panel - Testimonial/Brand */}
			<motion.div
				animate={isLoaded ? { opacity: 1 } : {}}
				className="relative hidden flex-col items-center justify-center bg-neutral-100 p-12 lg:flex lg:w-1/2 dark:bg-[#0a0a0a]"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.8 }}
			>
				{/* Subtle noise texture overlay */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
					}}
				/>

				{/* Time Flow Animation - Floating particles */}
				<div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
					{/* Floating motes - representing moments in time */}
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[15%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 18,
							repeat: Number.POSITIVE_INFINITY,
							delay: 0,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[35%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 22,
							repeat: Number.POSITIVE_INFINITY,
							delay: 3,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[55%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							delay: 6,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[75%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 24,
							repeat: Number.POSITIVE_INFINITY,
							delay: 9,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[25%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 19,
							repeat: Number.POSITIVE_INFINITY,
							delay: 12,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[85%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 21,
							repeat: Number.POSITIVE_INFINITY,
							delay: 15,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[45%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 23,
							repeat: Number.POSITIVE_INFINITY,
							delay: 2,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[65%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 17,
							repeat: Number.POSITIVE_INFINITY,
							delay: 5,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[95%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 25,
							repeat: Number.POSITIVE_INFINITY,
							delay: 8,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[5%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							delay: 11,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[50%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 26,
							repeat: Number.POSITIVE_INFINITY,
							delay: 14,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ top: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute left-[80%] h-3 w-3 rounded-full bg-primary/30"
						initial={{ top: "110%", opacity: 0 }}
						transition={{
							duration: 18,
							repeat: Number.POSITIVE_INFINITY,
							delay: 17,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "35%", y: "110%", opacity: 0 }}
						transition={{
							duration: 22,
							repeat: Number.POSITIVE_INFINITY,
							delay: 3,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "55%", y: "110%", opacity: 0 }}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							delay: 6,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "75%", y: "110%", opacity: 0 }}
						transition={{
							duration: 24,
							repeat: Number.POSITIVE_INFINITY,
							delay: 9,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "25%", y: "110%", opacity: 0 }}
						transition={{
							duration: 19,
							repeat: Number.POSITIVE_INFINITY,
							delay: 12,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "85%", y: "110%", opacity: 0 }}
						transition={{
							duration: 21,
							repeat: Number.POSITIVE_INFINITY,
							delay: 15,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "45%", y: "110%", opacity: 0 }}
						transition={{
							duration: 23,
							repeat: Number.POSITIVE_INFINITY,
							delay: 2,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "65%", y: "110%", opacity: 0 }}
						transition={{
							duration: 17,
							repeat: Number.POSITIVE_INFINITY,
							delay: 5,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "95%", y: "110%", opacity: 0 }}
						transition={{
							duration: 25,
							repeat: Number.POSITIVE_INFINITY,
							delay: 8,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "5%", y: "110%", opacity: 0 }}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							delay: 11,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "50%", y: "110%", opacity: 0 }}
						transition={{
							duration: 26,
							repeat: Number.POSITIVE_INFINITY,
							delay: 14,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.2, 0.2, 0] }}
						className="absolute h-3 w-3 rounded-full bg-primary/30"
						initial={{ x: "80%", y: "110%", opacity: 0 }}
						transition={{
							duration: 18,
							repeat: Number.POSITIVE_INFINITY,
							delay: 17,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.8, 0.8, 0] }}
						className="absolute h-2 w-2 rounded-full bg-primary/30"
						initial={{ x: "45%", y: "110%", opacity: 0 }}
						transition={{
							duration: 22,
							repeat: Number.POSITIVE_INFINITY,
							delay: 3,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.8, 0.8, 0] }}
						className="absolute h-2 w-2 rounded-full bg-primary/30"
						initial={{ x: "65%", y: "110%", opacity: 0 }}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							delay: 6,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.8, 0.8, 0] }}
						className="absolute h-2 w-2 rounded-full bg-primary/30"
						initial={{ x: "35%", y: "110%", opacity: 0 }}
						transition={{
							duration: 24,
							repeat: Number.POSITIVE_INFINITY,
							delay: 9,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.8, 0.8, 0] }}
						className="absolute h-2 w-2 rounded-full bg-primary/30"
						initial={{ x: "75%", y: "110%", opacity: 0 }}
						transition={{
							duration: 19,
							repeat: Number.POSITIVE_INFINITY,
							delay: 12,
							ease: "linear",
						}}
					/>
					<motion.div
						animate={{ y: "-10%", opacity: [0, 0.8, 0.8, 0] }}
						className="absolute h-2 w-2 rounded-full bg-primary/30"
						initial={{ x: "55%", y: "110%", opacity: 0 }}
						transition={{
							duration: 21,
							repeat: Number.POSITIVE_INFINITY,
							delay: 15,
							ease: "linear",
						}}
					/>

					{/* Expanding time rings - representing ripples in time */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						<motion.div
							animate={{
								width: [100, 1200],
								height: [100, 1200],
								x: [-50, -600],
								y: [-50, -600],
								opacity: [0, 0.2, 0],
							}}
							className="absolute rounded-full border-2 border-primary/20"
							initial={{ width: 100, height: 100, x: -50, y: -50, opacity: 0 }}
							transition={{
								duration: 12,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0,
								ease: "easeOut",
							}}
						/>
						<motion.div
							animate={{
								width: [100, 1200],
								height: [100, 1200],
								x: [-50, -600],
								y: [-50, -600],
								opacity: [0, 0.2, 0],
							}}
							className="absolute rounded-full border-2 border-primary/20"
							initial={{ width: 100, height: 100, x: -50, y: -50, opacity: 0 }}
							transition={{
								duration: 12,
								repeat: Number.POSITIVE_INFINITY,
								delay: 4,
								ease: "easeOut",
							}}
						/>
						<motion.div
							animate={{
								width: [100, 1200],
								height: [100, 1200],
								x: [-50, -600],
								y: [-50, -600],
								opacity: [0, 0.2, 0],
							}}
							className="absolute rounded-full border-2 border-primary/20"
							initial={{ width: 100, height: 100, x: -50, y: -50, opacity: 0 }}
							transition={{
								duration: 12,
								repeat: Number.POSITIVE_INFINITY,
								delay: 8,
								ease: "easeOut",
							}}
						/>
					</div>
				</div>

				{/* Logo */}
				<motion.div
					animate={isLoaded ? { opacity: 1, y: 0 } : {}}
					className="absolute top-8 left-8"
					initial={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<svg
						className="h-8 w-8 text-foreground"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						viewBox="0 0 24 24"
					>
						<title>Chrono Logo</title>
						<circle cx="12" cy="12" r="10" />
						<path
							d="M12 6v6l4 2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</motion.div>

				{/* Testimonial Content */}
				<motion.div
					animate={isLoaded ? { opacity: 1, y: 0 } : {}}
					className="relative z-10 max-w-md text-center"
					initial={{ opacity: 0, y: 30 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					<p className="mb-8 text-foreground/90 text-xl leading-relaxed">
						<span className="font-medium text-foreground">
							I finally have a single place for all my daily reflections.
						</span>{" "}
						Chrono helped me build a habit of mindful journaling without the
						friction of traditional apps. The mood tracking and insights have
						transformed how I understand my emotional patterns.
					</p>

					<div className="flex items-center justify-center gap-3 text-muted-foreground text-sm">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30 font-medium text-primary">
							SK
						</div>
						<div className="text-left">
							<p className="font-medium text-foreground">Sarah Kim</p>
							<p>Product Designer • San Francisco</p>
						</div>
					</div>
				</motion.div>

				{/* Decorative gradient orb */}
				<div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-primary/5 to-transparent" />
			</motion.div>

			{/* Right Panel - Auth Form */}
			<div className="relative flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2 lg:p-12">
				{/* Mobile Logo */}
				<motion.div
					animate={isLoaded ? { opacity: 1 } : {}}
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
						<path
							d="M12 6v6l4 2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</motion.div>

				<motion.div
					animate={isLoaded ? { opacity: 1, y: 0 } : {}}
					className="w-full max-w-sm"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
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
						animate={isLoaded ? { opacity: 1 } : {}}
						className="mt-6 text-center"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<p className="text-muted-foreground text-sm">
							Already have an account?{" "}
							<Link
								className="text-foreground underline transition-colors hover:text-primary"
								href="/auth/signin"
							>
								Sign in
							</Link>
						</p>
					</motion.div>

					{/* Footer */}
					<motion.p
						animate={isLoaded ? { opacity: 1 } : {}}
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
			</div>
		</div>
	);
}
