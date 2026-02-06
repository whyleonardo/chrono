import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const configDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(configDir, "src"),
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: [resolve(configDir, "src/test/setup.ts")],
	},
});
