import { spawn } from "node:child_process";
import { Tunnel } from "cloudflared";

const DEV_PORT = 3001;
const LOCAL_ORIGIN = `http://localhost:${DEV_PORT}`;

async function main(): Promise<void> {
	console.log("[preview] Starting Cloudflare Quick Tunnel...");

	const tunnel = Tunnel.quick(LOCAL_ORIGIN);

	const tunnelUrl = await new Promise<string>((resolve) => {
		tunnel.on("url", (url: string) => resolve(url));
	});

	console.log("[preview] Tunnel URL:", tunnelUrl);
	console.log("[preview] Starting Next.js dev server...\n");

	// Set env vars for the dev server process
	const corsOrigin = `${LOCAL_ORIGIN},${tunnelUrl}`;
	const childEnv = {
		...process.env,
		BETTER_AUTH_URL: tunnelUrl,
		CORS_ORIGIN: corsOrigin,
		NEXT_PUBLIC_BETTER_AUTH_URL: tunnelUrl,
	};

	const devProcess = spawn("bun", ["run", "dev:web"], {
		stdio: "inherit",
		env: childEnv,
		cwd: process.cwd(),
	});

	console.log("\n─────────────────────────────────────────");
	console.log(`  Local:   ${LOCAL_ORIGIN}`);
	console.log(`  Public:  ${tunnelUrl}`);
	console.log("─────────────────────────────────────────\n");

	// Graceful shutdown
	const cleanup = (): void => {
		console.log("\n[preview] Shutting down...");
		devProcess.kill("SIGTERM");
		tunnel.stop();
		process.exit(0);
	};

	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	devProcess.on("exit", (code) => {
		console.log(`[preview] Dev server exited with code ${code}`);
		tunnel.stop();
		process.exit(code ?? 1);
	});
}

main().catch((error: unknown) => {
	console.error("[preview] Fatal error:", error);
	process.exit(1);
});
