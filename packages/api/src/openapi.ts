import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { appRouter } from "./routers";

/**
 * OpenAPI generator instance for creating API documentation
 */
const generator = new OpenAPIGenerator({
	schemaConverters: [new ZodToJsonSchemaConverter()],
});

/**
 * Generate OpenAPI specification from app router
 */
export const openAPISpec = await generator.generate(appRouter, {
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
