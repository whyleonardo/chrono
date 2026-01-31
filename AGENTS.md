# Chrono Development Guide for AI Agents

You are a senior Chrono engineer working in a Bun/Turborepo monorepo. You prioritize type safety, security, and small, reviewable diffs.

## Agent Skills Reference

This project incorporates industry-leading best practices from curated agent skills. When working on code, especially frontend and React/Next.js development, refer to the skills in `.agents/skills/`:

- **Frontend Design** (`frontend-design`) - Create distinctive, production-grade UIs with intentional aesthetic choices
- **Composition Patterns** (`vercel-composition-patterns`) - Build scalable React components avoiding boolean prop proliferation
- **React Best Practices** (`vercel-react-best-practices`) - 57 performance optimization rules across 8 priority categories
- **Web Interface Guidelines** (`web-design-guidelines`) - Comprehensive web standards for accessibility, forms, and UX

**Source**: [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) and [Anthropic Skills](https://github.com/anthropics/skills)

When these skills conflict with existing guidelines below, **the skill guidelines take precedence** as they represent the most current industry best practices.

## Do

- Use `select` in Drizzle queries instead of selecting all fields for performance and security
- Use `import type { X }` for TypeScript type imports
- Use early returns to reduce nesting: `if (!user) return null;`
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Create PRs in draft mode by default
- Run `bun run check-types` before concluding CI failures are unrelated to your changes
- Import directly from source files, not barrel files (e.g., `@chrono/ui/components/button` not `@chrono/ui`)
- Use `date-fns` for date manipulation and formatting
- Put permission checks in `page.tsx`, never in `layout.tsx`
- Use Biome (via Ultracite) for formatting and linting
- Use Server Components by default in Next.js App Router
- Validate all API inputs with Zod schemas
- Use ORPC procedures for type-safe API endpoints

## Don't

- Never use `as any` - use proper type-safe solutions instead
- Never commit secrets, API keys, or `.env` files
- Never modify auto-generated files (e.g., Drizzle migrations after generation)
- Never put business logic in database query files - that belongs in API/service layer
- Never use barrel imports from index.ts files
- Never skip running type checks before pushing
- Never create large PRs (>500 lines or >10 files) - split them instead
- Never expose sensitive data (credentials, tokens) in API responses
- Never use `console.log` in production code - use proper logging

## PR Size Guidelines

Large PRs are difficult to review, prone to errors, and slow down the development process. Always aim for smaller, self-contained PRs that are easier to understand and review.

### Size Limits

- **Lines changed**: Keep PRs under 500 lines of code (additions + deletions)
- **Files changed**: Keep PRs under 10 code files
- **Single responsibility**: Each PR should do one thing well

**Note**: These limits apply to code files only. Non-code files like documentation (README.md, CHANGELOG.md), lock files (bun.lock), and auto-generated files are excluded from the count.

### How to Split Large Changes

When a task requires extensive changes, break it into multiple PRs:

1. **By layer**: Separate database/schema changes, backend logic, and frontend UI into different PRs
2. **By feature component**: Split a feature into its constituent parts (e.g., API endpoint PR, then UI PR, then integration PR)
3. **By refactor vs feature**: Do preparatory refactoring in a separate PR before adding new functionality
4. **By dependency order**: Create PRs in the order they can be merged (base infrastructure first, then features that depend on it)

### Examples of Good PR Splits

**Instead of one large "Add user dashboard" PR:**
- PR 1: Add dashboard schema and migrations
- PR 2: Add dashboard API endpoints with ORPC
- PR 3: Add dashboard UI components
- PR 4: Integrate dashboard into main app

**Instead of one large "Refactor authentication" PR:**
- PR 1: Extract auth logic into dedicated service
- PR 2: Update Better-Auth configuration
- PR 3: Migrate existing auth flows to new structure
- PR 4: Add new authentication features

### Benefits of Smaller PRs

- Faster review cycles and quicker feedback
- Easier to identify and fix issues
- Lower risk of merge conflicts
- Simpler to revert if problems arise
- Better git history and easier debugging

## Commands

### Development

```bash
# Start development server
bun run dev              # All apps
bun run dev:web          # Web app only

# Database
bun run db:push          # Push schema changes
bun run db:studio        # Open Drizzle Studio
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:start         # Start PostgreSQL (Docker)
bun run db:stop          # Stop PostgreSQL
```

### Code Quality

```bash
# Format and lint
bun run fix              # Fix all issues (Ultracite/Biome)
bun run check            # Check for issues

# Type checking
bun run check-types      # Type check all packages

# Build
bun run build            # Build all packages
```

### Package Management

```bash
# Install dependencies
bun install

# Add dependency to workspace
bun add <package> --workspace-name <workspace>

# Remove dependency
bun remove <package> --workspace-name <workspace>
```

## Boundaries

### Always do
- Run `bun run check-types` before committing
- Run `bun run fix` before pushing (Biome formatting)
- Use Zod schemas for all external input validation
- Follow conventional commits for PR titles
- Use Server Components for data fetching in Next.js

### Ask first
- Adding new dependencies to package.json
- Schema changes to database (packages/db/src/schema/)
- Changes affecting multiple packages
- Deleting files or packages
- Changing build configuration

### Never do
- Commit secrets, API keys, or `.env` files (use `.env.example` for templates)
- Use `as any` type casting
- Force push or rebase shared branches
- Modify generated migration files after creation
- Skip type checking or linting

## Project Structure

```
apps/
  web/                   # Main Next.js application (App Router)
    src/
      app/              # Next.js App Router pages
      components/       # App-specific components
      lib/              # Utilities

packages/
  api/                  # ORPC API layer (business logic)
    src/
      routers/          # ORPC router definitions
  auth/                 # Better-Auth configuration
  db/                   # Drizzle ORM schema and migrations
    src/
      schema/           # Database schema definitions
  env/                  # Environment variable validation (T3 Env)
  types/                # Shared TypeScript types
  ui/                   # Shared UI components (shadcn/ui, Radix)
  config/               # Shared TypeScript configurations
```

### Key files
- Routes: `apps/web/src/app/` (App Router)
- Database schema: `packages/db/src/schema/`
- API routers: `packages/api/src/routers/`
- Auth config: `packages/auth/src/`
- Environment validation: `packages/env/src/`

## Tech Stack

- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Drizzle ORM
- **API**: ORPC for type-safe APIs with OpenAPI support
- **Auth**: Better-Auth
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui with Radix UI
- **Validation**: Zod
- **State Management**: TanStack Query
- **Forms**: TanStack Form
- **Monorepo**: Turborepo
- **Linting**: Biome (via Ultracite)

## Code Examples

### Good error handling

```typescript
// Good - Descriptive error with context
throw new Error(`Unable to fetch user: User ${userId} not found`);

// Bad - Generic error
throw new Error("Failed");
```

### Good Drizzle query

```typescript
// Good - Select specific fields for performance and security
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
  columns: {
    id: true,
    name: true,
    email: true,
  },
});

// Bad - Selecting all fields including sensitive ones
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});
```

### Good ORPC procedure

```typescript
// Good - Type-safe with Zod validation
export const getUser = orpc
  .input(z.object({ userId: z.string().uuid() }))
  .output(z.object({ id: z.string(), name: z.string(), email: z.string() }))
  .query(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, input.userId),
      columns: { id: true, name: true, email: true },
    });
    if (!user) throw new Error("User not found");
    return user;
  });
```

### Good imports

```typescript
// Good - Type imports and direct paths
import type { User } from "@chrono/db/schema";
import { Button } from "@chrono/ui/components/button";

// Bad - Regular import for types, barrel imports
import { User } from "@chrono/db";
import { Button } from "@chrono/ui";
```

### Environment Variables

```typescript
// Good - Validated with T3 Env and Zod
import { env } from "@chrono/env/server";
const dbUrl = env.DATABASE_URL; // Type-safe and validated

// Bad - Unvalidated direct access
const dbUrl = process.env.DATABASE_URL; // Could be undefined
```

## PR Checklist

- [ ] Title follows conventional commits: `feat(scope): description`
- [ ] Type check passes: `bun run check-types`
- [ ] Lint passes: `bun run check`
- [ ] Relevant tests pass (if tests exist)
- [ ] Diff is small and focused (<500 lines, <10 files)
- [ ] No secrets or API keys committed
- [ ] Created as draft PR
- [ ] All API inputs validated with Zod
- [ ] Database queries use specific column selection

## When Stuck

- Ask a clarifying question before making large speculative changes
- Propose a short plan for complex tasks
- Open a draft PR with notes if unsure about approach
- Fix type errors before other errors - they're often the root cause
- Run `bun run db:generate` if you see missing type errors after schema changes
- Check package-specific AGENTS.md files for detailed guidelines

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

**Component Architecture:**
- Use function components over class components
- Don't add boolean props to customize behavior; use composition patterns instead
- Structure complex components with shared context (compound components)
- Create explicit variant components instead of boolean modes
- Don't define components inside other components

**Hooks & State:**
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use primitive dependencies in effects (not objects/arrays)
- Use functional setState for stable callbacks
- Use refs for transient, frequently-changing values

**JSX & Rendering:**
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Use ternary operators for conditionals, not `&&` (avoids rendering `0`)
- Hoist static JSX outside components for better performance

**Accessibility (Web Interface Guidelines):**
- Use semantic HTML (`<button>`, `<a>`, `<label>`, `<nav>`) before ARIA
- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`)
- Images need `alt` (or `alt=""` if decorative)
- Decorative icons need `aria-hidden="true"`
- Use `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- Headings hierarchical `<h1>`–`<h6>`; include skip link for main content

**Focus States:**
- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent
- Never `outline-none` without focus replacement
- Use `:focus-visible` over `:focus` (avoid focus ring on click)

**Forms:**
- Inputs need `autocomplete` and meaningful `name`
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- Never block paste (`onPaste` + `preventDefault`)
- Labels clickable (`htmlFor` or wrapping control)
- Errors inline next to fields; focus first error on submit
- Placeholders end with `…` and show example pattern

**Animation:**
- Honor `prefers-reduced-motion` (provide reduced variant or disable)
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all`—list properties explicitly

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize all user input with Zod
- Never expose sensitive data in API responses
- Use environment variables for secrets via @chrono/env

### Performance

**Critical Priority:**
- **Eliminate waterfalls**: Use `Promise.all()` for independent async operations; move `await` into branches where actually used
- **Avoid barrel imports**: Import directly from source files (e.g., `@chrono/ui/components/button` not `@chrono/ui`)
- **Use dynamic imports**: Lazy load heavy components with `next/dynamic`
- **Defer third-party scripts**: Load analytics/logging after hydration

**High Priority:**
- Use `React.cache()` for per-request deduplication in Server Components
- Minimize data passed to Client Components (serialization cost)
- Restructure components to parallelize data fetching
- Use Server Components for data fetching (better performance)

**Medium Priority:**
- Extract expensive work into memoized components with `React.memo`
- Use `startTransition` for non-urgent updates
- Virtualize long lists (>50 items) with `content-visibility: auto` or virtualization libraries
- Use Next.js `<Image>` component for optimized images

**General:**
- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Cache repeated property access in loops with variables
- Use `Set`/`Map` for O(1) lookups instead of array methods

## Package-Specific Guidelines

Each package has its own AGENTS.md file with specific guidelines:

- `apps/web/AGENTS.md` - Next.js App Router, React Query, ORPC client
- `packages/api/AGENTS.md` - ORPC server, API design, business logic
- `packages/auth/AGENTS.md` - Better-Auth, authentication patterns
- `packages/db/AGENTS.md` - Drizzle ORM, schema design, migrations
- `packages/env/AGENTS.md` - T3 Env, environment validation
- `packages/types/AGENTS.md` - TypeScript types, Zod schemas
- `packages/ui/AGENTS.md` - React components, Radix UI, TailwindCSS
- `packages/config/AGENTS.md` - TypeScript configuration

Refer to these files for package-specific best practices and patterns.
