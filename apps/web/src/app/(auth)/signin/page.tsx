"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignInPage() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [showEmailForm, setShowEmailForm] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		if (activeTab === "signin") {
			await signIn.email({
				email,
				password,
				callbackURL: "/dashboard",
			});
		} else {
			await signUp.email({
				email,
				password,
				name: email.split("@")[0],
				callbackURL: "/dashboard",
			});
		}

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
							Welcome to Chrono
						</h1>
						<p className="text-muted-foreground text-sm">
							Sign in or create an account
						</p>
					</div>

					{showEmailForm ? (
						<>
							{/* Back Button */}
							<motion.button
								animate={{ opacity: 1 }}
								className="mb-6 flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
								initial={{ opacity: 0 }}
								onClick={() => setShowEmailForm(false)}
								type="button"
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
							</motion.button>

							{/* Tab Switcher */}
							<div className="mb-6 flex rounded-md bg-muted p-1">
								<button
									className={`flex-1 rounded-sm py-2 font-medium text-sm transition-all ${
										activeTab === "signin"
											? "bg-background text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
									onClick={() => setActiveTab("signin")}
									type="button"
								>
									Sign In
								</button>
								<button
									className={`flex-1 rounded-sm py-2 font-medium text-sm transition-all ${
										activeTab === "signup"
											? "bg-background text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
									onClick={() => setActiveTab("signup")}
									type="button"
								>
									Sign Up
								</button>
							</div>

							{/* Email Form */}
							<form className="space-y-4" onSubmit={handleSubmit}>
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
										type="password"
										value={password}
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
										<span>
											{activeTab === "signin" ? "Sign In" : "Sign Up"}
										</span>
									)}
								</motion.button>
							</form>
						</>
					) : (
						<>
							{/* Social Auth Buttons */}
							<div className="space-y-3">
								<motion.button
									className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border font-medium text-sm transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50"
									onClick={() =>
										signIn.social({
											provider: "google",
											callbackURL: "/dashboard",
										})
									}
									type="button"
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
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
								</motion.button>

								<motion.button
									className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border font-medium text-sm transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50"
									onClick={() =>
										signIn.social({
											provider: "github",
											callbackURL: "/dashboard",
										})
									}
									type="button"
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<title>GitHub</title>
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
									</svg>
									Continue with GitHub
								</motion.button>
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

							{/* Show Other Options Button */}
							<motion.button
								className="h-11 w-full rounded-md border border-border bg-secondary/50 font-medium text-sm transition-all duration-200 hover:border-primary/30 hover:bg-secondary"
								onClick={() => setShowEmailForm(true)}
								type="button"
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
							>
								Show other options
							</motion.button>
						</>
					)}

					{/* Footer */}
					<motion.p
						animate={isLoaded ? { opacity: 1 } : {}}
						className="absolute right-0 bottom-8 left-0 px-6 text-center text-muted-foreground text-xs"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
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
					</motion.p>
				</motion.div>
			</div>
		</div>
	);
}
