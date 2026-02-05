import type { ReactNode } from "react";

declare module "react-day-picker" {
	export interface DayContentProps {
		date: Date;
	}

	export interface CustomComponents {
		DayContent?: (props: DayContentProps) => ReactNode;
	}
}
