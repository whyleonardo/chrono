import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../procedures";
import {
	createEntry,
	deleteEntry,
	getEntry,
	listEntries,
	toggleBragWorthy,
	updateEntry,
} from "./entries";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	entries: {
		create: createEntry,
		list: listEntries,
		get: getEntry,
		update: updateEntry,
		delete: deleteEntry,
		toggleBragWorthy,
	},
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
