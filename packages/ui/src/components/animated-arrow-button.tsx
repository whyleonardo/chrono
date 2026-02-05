"use client";

import { cn } from "@chrono/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { Button } from "./button";

interface AnimatedArrowButtonProps extends ComponentProps<typeof Button> {
	children: React.ReactNode;
}

export function AnimatedArrowButton({
	children,
	className,
	...props
}: AnimatedArrowButtonProps) {
	return (
		<Button
			className={cn("group/arrow-btn gap-2 overflow-hidden", className)}
			{...props}
		>
			{children}
			<motion.span
				className="inline-flex"
				initial={{ x: 0 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
				whileHover={{ x: 4 }}
			>
				<ArrowRightIcon aria-hidden="true" className="size-4" />
			</motion.span>
		</Button>
	);
}
