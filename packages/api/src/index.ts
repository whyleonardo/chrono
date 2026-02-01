import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

export const protectedProcedure = publicProcedure.use(requireAuth);

// Export OpenAPI specification
export { openAPISpec } from "./openapi";
// Export entry router procedures
export {
	createEntry,
	deleteEntry,
	getEntry,
	listEntries,
	toggleBragWorthy,
	updateEntry,
} from "./routers/entries";
