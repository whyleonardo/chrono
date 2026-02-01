import { generateOpenAPI } from "@orpc/openapi";
import { appRouter } from "./routers";

/**
 * Generate OpenAPI specification from app router
 */
export const openAPISpec = generateOpenAPI({
	router: appRouter,
	info: {
		title: "Chrono API",
		version: "1.0.0",
		description: "API for Chrono career journal application",
	},
	servers: [
		{
			url: "/api",
			description: "Local development server",
		},
	],
	security: [
		{
			bearerAuth: [],
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
	},
});

export default openAPISpec;
