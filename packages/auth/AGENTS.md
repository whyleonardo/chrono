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

## Package-Specific Guidelines: packages/auth

This package handles **authentication configuration and logic** using Better-Auth.

### Key Libraries & Frameworks

- **Better-Auth** - Modern authentication library
- **Zod** - Schema validation
- **@chrono/db** - Database integration for user storage
- **@chrono/env** - Environment variables

### Better-Auth Best Practices

- Configure auth providers consistently (OAuth, email/password, etc.)
- Use Better-Auth's built-in security features (CSRF, session management)
- Implement proper session handling and token management
- Use Better-Auth hooks and middleware correctly
- Keep auth configuration centralized in this package

### Security Guidelines

- **Never** store passwords in plain text
- Use Better-Auth's built-in password hashing
- Implement proper session expiration and renewal
- Use secure, httpOnly cookies for session tokens
- Implement rate limiting for authentication endpoints
- Validate all authentication inputs thoroughly
- Use CSRF protection for state-changing operations
- Implement proper password requirements (length, complexity)
- Use secure random token generation
- Implement account lockout after failed login attempts

### Session Management

- Configure appropriate session durations
- Implement session refresh logic
- Handle session expiration gracefully
- Clean up expired sessions from database
- Use secure session storage
- Implement "remember me" functionality securely

### OAuth Integration

- Securely store OAuth client secrets in environment variables
- Validate OAuth redirect URIs
- Handle OAuth errors and edge cases
- Implement proper OAuth state validation
- Support multiple OAuth providers consistently

### Multi-Factor Authentication (if implemented)

- Use time-based one-time passwords (TOTP) or similar
- Provide backup codes for account recovery
- Implement proper MFA enrollment flow
- Allow users to manage MFA settings securely

### User Management

- Implement email verification for new accounts
- Provide secure password reset functionality
- Allow users to update their authentication methods
- Implement account deletion/deactivation
- Log authentication events for security auditing

### Integration with Database

- Use @chrono/db for storing user credentials and sessions
- Implement proper database schema for auth tables
- Use database transactions for critical auth operations
- Index frequently queried auth fields (email, session tokens)

### Error Handling

- Don't leak information about user existence in error messages
- Use generic error messages for failed authentication
- Log detailed errors server-side for debugging
- Implement proper error types for different auth failures

### Testing

**Test Framework:** Vitest

- Import test utilities from `vitest` (`describe`, `it`, `expect`, `beforeAll`, `afterAll`)
- Test all authentication flows (signup, login, logout)
- Test password reset and email verification
- Test OAuth flows with mock providers
- Test session management and expiration
- Test security edge cases (timing attacks, brute force)
- Run tests with: `vitest run`

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
