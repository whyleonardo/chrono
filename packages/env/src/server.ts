import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { join } from "path";
import { z } from "zod";

// Load .env.test in test environment, otherwise load default .env
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

// Try multiple locations for .env files (in order of priority)
const possiblePaths = [
	// 1. Current working directory (for packages/db, packages/api, etc.)
	join(process.cwd(), envFile),
	// 2. Apps/web directory (for the web app)
	join(process.cwd(), "apps/web", envFile),
	// 3. Parent directory (when running from a package subdirectory)
	join(process.cwd(), "..", envFile),
];

// Find and load the first existing .env file
for (const envPath of possiblePaths) {
	if (existsSync(envPath)) {
		dotenv.config({ path: envPath });
		break;
	}
}

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().min(1),
		CORS_ORIGIN: z.string().min(1),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
