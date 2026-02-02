"use client";

import { motion } from "motion/react";

export function TimeFlowAnimation() {
	return (
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
	);
}
