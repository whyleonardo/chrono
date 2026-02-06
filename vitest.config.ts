import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "apps/web/src"),
		},
	},
	test: {
		environmentMatchGlobs: [["apps/web/**/*.test.{ts,tsx}", "jsdom"]],
		setupFiles: [resolve(__dirname, "vitest.setup.ts")],
	},
});
