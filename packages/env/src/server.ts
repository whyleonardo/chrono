import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { join } from "path";
import { z } from "zod";

// Load .env.test in test environment, otherwise load default .env
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
const envPath = join(process.cwd(), "apps/web", envFile);
dotenv.config({ path: envPath });

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
