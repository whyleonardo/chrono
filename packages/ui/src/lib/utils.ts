import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for conditional Tailwind classes
 *
 * Usage:
 * ```tsx
 * className={cn(
 *   "base-classes",
 *   moodTw[mood].bg,
 *   isSelected && "ring-2"
 * )}
 * ```
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
