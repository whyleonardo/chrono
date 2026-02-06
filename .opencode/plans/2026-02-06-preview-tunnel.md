# Preview Tunnel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `bun run preview` command that starts the Next.js dev server and exposes it via a Cloudflare Quick Tunnel, printing a public HTTPS URL accessible from any device.

**Architecture:** A standalone TypeScript script (`scripts/preview.ts`) orchestrates two processes: the Next.js dev server (`next dev --port 3001`) and a Cloudflare Quick Tunnel pointing to `localhost:3001`. The tunnel URL is detected via event listener and injected as environment variables (`BETTER_AUTH_URL`, `CORS_ORIGIN`, `NEXT_PUBLIC_BETTER_AUTH_URL`) so auth and CORS work over the public URL. CORS is configured to accept multiple origins (both localhost and tunnel URL) so local browser access still works.

**Tech Stack:** Bun runtime, `cloudflared` npm package (Cloudflare Quick Tunnel - no account required), Next.js 16, Better-Auth, T3 Env

---

## Context for the implementor

### Files you need to understand

| File | Role |
|------|------|
| `package.json` (root) | Monorepo scripts, where `preview` script will be added |
| `apps/web/package.json` | Web app scripts, `next dev --port 3001` |
| `packages/env/src/server.ts` | Server env validation (T3 Env). `CORS_ORIGIN` is `z.string().min(1)` |
| `packages/auth/src/index.ts` | Better-Auth config. Uses `env.CORS_ORIGIN` for `trustedOrigins` |
| `apps/web/src/lib/auth-client.ts` | Client auth. Uses `NEXT_PUBLIC_BETTER_AUTH_URL` with fallback to `localhost:3001` |
| `apps/web/src/utils/orpc.ts` | ORPC client. Already tunnel-friendly: uses `window.location.origin` on client side |

### Why these env vars matter

- **`BETTER_AUTH_URL`** - Server-side auth base URL. Better-Auth uses this to validate callbacks and redirects.
- **`CORS_ORIGIN`** - Passed to `trustedOrigins` in Better-Auth. Requests from the tunnel domain will be rejected without this.
- **`NEXT_PUBLIC_BETTER_AUTH_URL`** - Client-side auth base URL. The auth client in the browser needs to know where to send auth requests.

### What already works with tunnels

- **ORPC client** (`apps/web/src/utils/orpc.ts:23`) - Uses `window.location.origin` on client side, so API calls automatically go to the tunnel URL. No changes needed.
- **Next.js dev server** - Accepts connections from any origin by default in dev mode.

---

## Task 1: Install `cloudflared` dependency

**Files:**
- Modify: `package.json` (root) — add dev dependency

**Step 1: Install the package**

Run:
```bash
bun add -d cloudflared --workspace-name chrono
```

Expected: `cloudflared` appears in root `devDependencies` in `package.json`. This package auto-downloads the `cloudflared` binary on install.

**Step 2: Verify the binary is available**

Run:
```bash
bun -e "import { bin } from 'cloudflared'; console.log(bin)"
```

Expected: Prints a path to the `cloudflared` binary (e.g., `/root/code/chrono/node_modules/cloudflared/...`).

**Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add cloudflared dependency for preview tunnels"
```

---

## Task 2: Update CORS_ORIGIN to support multiple origins

Currently `CORS_ORIGIN` is a single string. We need it to support comma-separated origins so both `http://localhost:3001` and the tunnel URL work simultaneously.

**Files:**
- Create: `packages/env/src/cors.ts`
- Create: `packages/env/src/server.test.ts`
- Modify: `packages/env/package.json` — add `./cors` export
- Modify: `packages/auth/src/index.ts:14` — parse comma-separated origins

### Step 1: Write the failing test

Create: `packages/env/src/server.test.ts`

```typescript
import { describe, expect, it } from "vitest";
import { parseCorsOrigins } from "./cors";

describe("parseCorsOrigins", () => {
  it("parses a single origin", () => {
    expect(parseCorsOrigins("http://localhost:3001")).toEqual([
      "http://localhost:3001",
    ]);
  });

  it("parses comma-separated origins", () => {
    expect(
      parseCorsOrigins(
        "http://localhost:3001,https://random-subdomain.trycloudflare.com"
      )
    ).toEqual([
      "http://localhost:3001",
      "https://random-subdomain.trycloudflare.com",
    ]);
  });

  it("trims whitespace around origins", () => {
    expect(
      parseCorsOrigins("http://localhost:3001 , https://example.com")
    ).toEqual(["http://localhost:3001", "https://example.com"]);
  });

  it("filters out empty strings", () => {
    expect(parseCorsOrigins("http://localhost:3001,,")).toEqual([
      "http://localhost:3001",
    ]);
  });
});
```

### Step 2: Run test to verify it fails

Run:
```bash
bun run test -- packages/env/src/server.test.ts
```

Expected: FAIL — `parseCorsOrigins` does not exist yet.

### Step 3: Write the implementation

Create: `packages/env/src/cors.ts`

```typescript
/**
 * Parses a comma-separated string of origins into an array.
 * Trims whitespace and filters empty strings.
 */
export function parseCorsOrigins(origins: string): string[] {
  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
```

### Step 4: Run test to verify it passes

Run:
```bash
bun run test -- packages/env/src/server.test.ts
```

Expected: PASS — all 4 tests green.

### Step 5: Export `cors` from `@chrono/env` package

Modify: `packages/env/package.json` — add the `./cors` export.

Check the current exports in `packages/env/package.json` and add:
```json
"./cors": {
  "types": "./src/cors.ts",
  "default": "./src/cors.ts"
}
```

### Step 6: Update Better-Auth to use parsed origins

Modify: `packages/auth/src/index.ts`

Change line 14 from:
```typescript
trustedOrigins: [env.CORS_ORIGIN],
```

To:
```typescript
trustedOrigins: parseCorsOrigins(env.CORS_ORIGIN),
```

Add the import at the top:
```typescript
import { parseCorsOrigins } from "@chrono/env/cors";
```

### Step 7: Run type check

Run:
```bash
bun run check-types
```

Expected: PASS — no type errors.

### Step 8: Run all tests

Run:
```bash
bun run test
```

Expected: PASS — all tests green (existing + new).

### Step 9: Commit

```bash
git add packages/env/src/cors.ts packages/env/src/server.test.ts packages/env/package.json packages/auth/src/index.ts
git commit -m "feat: support comma-separated CORS origins for multi-origin dev"
```

---

## Task 3: Create the preview script

This is the main script that orchestrates the tunnel + dev server.

**Files:**
- Create: `scripts/preview.ts`

### Step 1: Create the script

Create: `scripts/preview.ts`

```typescript
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
```

### Step 2: Verify the script compiles

Run:
```bash
bun build scripts/preview.ts --no-bundle --outdir /tmp/preview-check
```

Expected: Compiles without errors.

### Step 3: Commit

```bash
git add scripts/preview.ts
git commit -m "feat: add preview tunnel script using Cloudflare Quick Tunnel"
```

---

## Task 4: Add the `preview` script to package.json

**Files:**
- Modify: `package.json` (root)

### Step 1: Add the script

Add to the `scripts` section of root `package.json`:

```json
"preview": "bun run scripts/preview.ts"
```

### Step 2: Verify the script is recognized

Run:
```bash
grep '"preview"' package.json
```

Expected: The `preview` script appears in `package.json`.

### Step 3: Commit

```bash
git add package.json
git commit -m "feat: add bun run preview script"
```

---

## Task 5: Update .env.example with CORS documentation

**Files:**
- Modify: `apps/web/.env.example`

### Step 1: Update the example

Update the `CORS_ORIGIN` line in `apps/web/.env.example` to document comma-separated support:

```env
# Comma-separated for multiple origins (e.g., local + tunnel)
CORS_ORIGIN="http://localhost:3001"
```

### Step 2: Commit

```bash
git add apps/web/.env.example
git commit -m "docs: document comma-separated CORS_ORIGIN in .env.example"
```

---

## Task 6: End-to-end smoke test

This is a manual verification task.

### Step 1: Start the preview

Run:
```bash
bun run preview
```

Expected output (similar to):
```
[preview] Starting Cloudflare Quick Tunnel...
[preview] Tunnel URL: https://some-random-words.trycloudflare.com
[preview] Starting Next.js dev server...

─────────────────────────────────────────
  Local:   http://localhost:3001
  Public:  https://some-random-words.trycloudflare.com
─────────────────────────────────────────
```

### Step 2: Verify local access works

Open `http://localhost:3001` in a browser on the VPS (or curl it).

Run:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
```

Expected: `200`

### Step 3: Verify tunnel access works

Open the printed `https://....trycloudflare.com` URL from any device (phone, tablet, etc.).

Run:
```bash
curl -s -o /dev/null -w "%{http_code}" https://<tunnel-url>
```

Expected: `200`

### Step 4: Verify auth works over tunnel

1. Navigate to `https://<tunnel-url>/signin` on your phone
2. Sign in or sign up
3. Verify you're redirected to `/dashboard` successfully

### Step 5: Verify graceful shutdown

Press `Ctrl+C` in the terminal running `bun run preview`.

Expected:
```
[preview] Shutting down...
```

Both the dev server and tunnel should exit cleanly.

---

## Summary of all changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` (root) | Modify | Add `cloudflared` dev dep + `preview` script |
| `packages/env/src/cors.ts` | Create | `parseCorsOrigins()` utility function |
| `packages/env/src/server.test.ts` | Create | Tests for `parseCorsOrigins` |
| `packages/env/package.json` | Modify | Add `./cors` export |
| `packages/auth/src/index.ts` | Modify | Use `parseCorsOrigins()` for `trustedOrigins` |
| `scripts/preview.ts` | Create | Tunnel + dev server orchestrator |
| `apps/web/.env.example` | Modify | Document comma-separated CORS_ORIGIN |

**Total new files:** 3 | **Modified files:** 4 | **Estimated diff:** ~120 lines
