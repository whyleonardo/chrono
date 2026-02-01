# Auth Screens Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement sign in/sign up screens with Better Auth integration, route guards, and the Time Flow animation.

**Architecture:** Create Better Auth configuration in packages/auth, implement auth client in apps/web, build signin/signup pages with the existing Time Flow animation prototype, and add route guards to protect authenticated routes.

**Tech Stack:** Better Auth, Next.js App Router, React, Motion, TailwindCSS, Drizzle ORM

---

## Prerequisites

Before starting, ensure you have:
1. Google OAuth credentials (client ID and secret)
2. GitHub OAuth credentials (client ID and secret)
3. Database running (`bun run db:start`)

---

### Task 1: Setup Environment Variables

**Files:**
- Create: `apps/web/.env.local`
- Modify: `apps/web/.env.example`
- Modify: `packages/auth/.env.example`

**Step 1: Generate Better Auth secret**

Run: `openssl rand -base64 32`

Copy the output (32 character string).

**Step 2: Create local env file**

```bash
# apps/web/.env.local
BETTER_AUTH_SECRET="paste-generated-secret-here"
BETTER_AUTH_URL="http://localhost:3001"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Step 3: Update .env.example templates**

```bash
# apps/web/.env.example
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3001"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

**Step 4: Commit**

```bash
git add apps/web/.env.example
# Do NOT commit .env.local
git commit -m "chore(auth): add environment variable templates"
```

---

### Task 2: Configure Better Auth Server

**Files:**
- Modify: `packages/auth/src/index.ts`

**Step 1: Read current auth index file**

Read: `/home/whyleonardo/code/chrono/packages/auth/src/index.ts`

**Step 2: Add Better Auth configuration**

```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@chrono/db"
import * as schema from "@chrono/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})

export type Auth = typeof auth
```

**Step 3: Check types**

Run: `bun run check-types`
Expected: PASS (or existing errors not related to this change)

**Step 4: Commit**

```bash
git add packages/auth/src/index.ts
git commit -m "feat(auth): configure Better Auth with Google and GitHub providers"
```

---

### Task 3: Create Auth Client

**Files:**
- Create: `apps/web/src/lib/auth-client.ts`

**Step 1: Create auth client file**

```typescript
import { createAuthClient } from "better-auth/react"
import type { Auth } from "@chrono/auth"

export const authClient = createAuthClient<Auth>({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3001",
})

// Export commonly used methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient
```

**Step 2: Check types**

Run: `bun run check-types`
Expected: PASS

**Step 3: Commit**

```bash
git add apps/web/src/lib/auth-client.ts
git commit -m "feat(auth): create Better Auth client for React"
```

---

### Task 4: Generate Database Schema

**Files:**
- Modify: `packages/db/src/schema/index.ts`
- Create: `packages/db/src/schema/auth.ts`

**Step 1: Create auth schema file**

```typescript
// packages/db/src/schema/auth.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

**Step 2: Export from schema index**

Add to `packages/db/src/schema/index.ts`:

```typescript
export * from "./auth"
```

**Step 3: Generate migrations**

Run: `cd packages/db && bun run db:generate`
Expected: Creates migration files for auth tables

**Step 4: Run migrations**

Run: `cd packages/db && bun run db:migrate`
Expected: Tables created in database

**Step 5: Commit**

```bash
git add packages/db/src/schema/
git commit -m "feat(auth): add Better Auth database schema"
```

---

### Task 5: Create API Route Handler

**Files:**
- Create: `apps/web/src/app/api/auth/[...all]/route.ts`

**Step 1: Create API route**

```typescript
import { auth } from "@chrono/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth.handler)
```

**Step 2: Check types**

Run: `bun run check-types`
Expected: PASS

**Step 3: Commit**

```bash
git add apps/web/src/app/api/auth/
git commit -m "feat(auth): create API route handler for Better Auth"
```

---

### Task 6: Copy Prototype to Sign In Page

**Files:**
- Create: `apps/web/src/app/(auth)/signin/page.tsx`
- Reference: `apps/web/src/app/(auth)/prototype/page.tsx`

**Step 1: Copy prototype content**

Copy the entire content from `apps/web/src/app/(auth)/prototype/page.tsx` to `apps/web/src/app/(auth)/signin/page.tsx`.

**Step 2: Update imports and add auth logic**

Add import at top:
```typescript
import { signIn } from "@/lib/auth-client"
```

Replace the handleSubmit function:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  if (activeTab === "signin") {
    await signIn.email({
      email,
      password,
      callbackURL: "/dashboard"
    })
  } else {
    // Sign up
    await signUp.email({
      email,
      password,
      name: email.split("@")[0], // Default name from email
      callbackURL: "/dashboard"
    })
  }
  
  setIsLoading(false)
}
```

Update social auth buttons:
```typescript
// Google button
<motion.button
  type="button"
  onClick={() => signIn.social({ provider: "google", callbackURL: "/dashboard" })}
  // ... rest of button
>

// GitHub button
<motion.button
  type="button"
  onClick={() => signIn.social({ provider: "github", callbackURL: "/dashboard" })}
  // ... rest of button
>
```

**Step 3: Check types**

Run: `bun run check-types`
Expected: PASS

**Step 4: Test page loads**

Run: `bun run dev`
Navigate: `http://localhost:3001/auth/signin`
Expected: Page loads with Time Flow animation

**Step 5: Commit**

```bash
git add apps/web/src/app/(auth)/signin/page.tsx
git commit -m "feat(auth): create sign in page with Time Flow animation"
```

---

### Task 7: Create Sign Up Page

**Files:**
- Create: `apps/web/src/app/(auth)/signup/page.tsx`

**Step 1: Create signup page**

Create a redirect from signup to signin with signup tab active:

```typescript
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/auth/signin?tab=signup")
  }, [router])
  
  return null
}
```

**Step 2: Update signin page to handle tab query param**

Modify `apps/web/src/app/(auth)/signin/page.tsx` to read the tab query parameter:

```typescript
"use client"

import { useSearchParams } from "next/navigation"
// ... other imports

export default function SignInPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    tab === "signup" ? "signup" : "signin"
  )
  
  // ... rest of component
}
```

**Step 3: Check types**

Run: `bun run check-types`
Expected: PASS

**Step 4: Commit**

```bash
git add apps/web/src/app/(auth)/signup/page.tsx apps/web/src/app/(auth)/signin/page.tsx
git commit -m "feat(auth): create signup page redirect with tab handling"
```

---

### Task 8: Create Auth Layout

**Files:**
- Create: `apps/web/src/app/(auth)/layout.tsx`

**Step 1: Create layout file**

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/src/app/(auth)/layout.tsx
git commit -m "feat(auth): create auth layout wrapper"
```

---

### Task 9: Create Route Guard Hook

**Files:**
- Create: `apps/web/src/lib/auth-guard.ts`

**Step 1: Create auth guard utility**

```typescript
import { auth } from "@chrono/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function requireAuth() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return session
}

export async function requireGuest() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }
}
```

**Step 2: Check types**

Run: `bun run check-types`
Expected: PASS

**Step 3: Commit**

```bash
git add apps/web/src/lib/auth-guard.ts
git commit -m "feat(auth): create route guard utilities"
```

---

### Task 10: Add Route Guards to Protected Pages

**Files:**
- Create: `apps/web/src/app/dashboard/page.tsx` (example)
- Modify: Add guards to other protected pages

**Step 1: Create example protected page**

```typescript
// apps/web/src/app/dashboard/page.tsx
import { requireAuth } from "@/lib/auth-guard"

export default async function DashboardPage() {
  const session = await requireAuth()
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name || session.user.email}</p>
    </div>
  )
}
```

**Step 2: Add guest guard to auth pages**

Modify `apps/web/src/app/(auth)/signin/page.tsx`:

Add at the top (Server Component wrapper):

```typescript
// apps/web/src/app/(auth)/signin/page.tsx
import { requireGuest } from "@/lib/auth-guard"

export default async function SignInPageWrapper() {
  await requireGuest()
  return <SignInClientPage />
}

"use client"
// ... move current page content to SignInClientPage component
```

**Step 3: Check types**

Run: `bun run check-types`
Expected: PASS

**Step 4: Test redirects**

1. Visit `/dashboard` while logged out → Should redirect to `/auth/signin`
2. Visit `/auth/signin` while logged in → Should redirect to `/dashboard`

**Step 5: Commit**

```bash
git add apps/web/src/app/dashboard/page.tsx apps/web/src/lib/auth-guard.ts
git commit -m "feat(auth): implement route guards on protected pages"
```

---

### Task 11: Run Full Test Suite

**Step 1: Check all types**

Run: `bun run check-types`
Expected: PASS

**Step 2: Run linting**

Run: `bun run check`
Expected: No new errors

**Step 3: Test auth flow**

1. Start dev server: `bun run dev`
2. Visit `/auth/signin`
3. Test Google sign in
4. Test GitHub sign in
5. Test email/password sign up
6. Test email/password sign in
7. Verify redirect to `/dashboard`
8. Test sign out
9. Verify protected routes redirect to signin

**Step 4: Final commit**

```bash
git commit -m "feat(auth): complete auth screens with Better Auth integration

- Add sign in page with Time Flow animation
- Add sign up page with tab handling
- Configure Better Auth with Google and GitHub OAuth
- Create database schema for auth
- Implement route guards for protected pages
- Add auth client utilities"
```

---

## Testing Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Sign in page loads with animation
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] Email/password sign up works
- [ ] Email/password sign in works
- [ ] Protected routes redirect unauthenticated users
- [ ] Auth pages redirect authenticated users
- [ ] Sign out works
- [ ] Type check passes
- [ ] Lint check passes

## Related

**Linear Issue:** DEV-36
**Prototype:** `/apps/web/src/app/(auth)/prototype/page.tsx`
**Better Auth Docs:** https://better-auth.com/docs
