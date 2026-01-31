# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

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

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

## Package-Specific Guidelines: packages/env

This package provides **environment variable validation and type safety** using T3 Env.

### Key Libraries & Frameworks

- **@t3-oss/env-core** - Core environment validation
- **@t3-oss/env-nextjs** - Next.js-specific environment handling
- **Zod** - Schema validation
- **dotenv** - Environment file loading

### T3 Env Best Practices

- Define separate schemas for server and client environment variables
- Use Zod schemas to validate environment variables at build time
- Export typed environment objects that are safe to use
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Keep sensitive credentials server-side only

### Environment Variable Organization

**Server Variables** (server.ts):
- Database credentials
- API keys and secrets
- Authentication secrets
- Internal service URLs
- Server configuration

**Client Variables** (web.ts):
- Public API URLs
- Feature flags visible to client
- Analytics IDs
- Public configuration

### Validation Guidelines

- Validate all environment variables with appropriate Zod schemas
- Use specific validators (`.url()`, `.email()`, `.uuid()`)
- Provide default values where appropriate
- Make required variables explicit (no `.optional()` unless truly optional)
- Use `.transform()` to normalize values (e.g., parse JSON)
- Group related variables together in the schema

### Security Best Practices

- **Never** commit `.env` files to version control
- Use `.env.example` to document required variables
- Prefix client variables with `NEXT_PUBLIC_` only when necessary
- Keep secrets in server-side environment only
- Use different credentials for different environments
- Rotate secrets regularly
- Use environment-specific values (dev, staging, production)

### Type Safety

- Export strongly-typed environment objects
- Use `env.DATABASE_URL` with full autocomplete and type checking
- Catch configuration errors at build time, not runtime
- Make TypeScript aware of all environment variables

### Configuration Patterns

```typescript
// Good: Validated and typed
import { env } from "@chrono/env/server";
const dbUrl = env.DATABASE_URL; // Type-safe, validated

// Bad: Unvalidated direct access
const dbUrl = process.env.DATABASE_URL; // Could be undefined
```

### Error Handling

- Fail fast if required environment variables are missing
- Provide clear error messages for missing or invalid variables
- Log configuration errors with helpful context
- Don't start the application with invalid configuration

### Development Workflow

- Keep `.env.example` up to date with required variables
- Document the purpose of each variable
- Use `.env.local` for local overrides
- Ensure all team members have required environment variables
- Use different `.env` files for different environments

### Common Patterns

- **Database URLs**: Validate as URL with proper protocol
- **Port Numbers**: Parse as number with reasonable bounds
- **Feature Flags**: Use boolean with default values
- **URLs**: Validate format and optionally check accessibility
- **Enum Values**: Use Zod enum for limited options
- **JSON Config**: Use Zod object schema with `.transform(JSON.parse)`

### Next.js Integration

- Client variables are inlined at build time
- Server variables are only available at runtime
- Use proper exports for server vs. client contexts
- Understand the implications of public environment variables

### Testing

**Test Framework:** Vitest

- Import test utilities from `vitest` (`describe`, `it`, `expect`)
- Mock environment variables in tests
- Test validation logic for edge cases
- Ensure required variables cause build failures
- Test default values work correctly
- Run tests with: `vitest run`

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
