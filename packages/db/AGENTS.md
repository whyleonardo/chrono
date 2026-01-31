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

## Package-Specific Guidelines: packages/db

This package manages **database schema and queries** using Drizzle ORM with PostgreSQL.

### Key Libraries & Frameworks

- **Drizzle ORM** - Type-safe SQL query builder
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **Drizzle Kit** - Schema migration tools
- **Zod** - Schema validation
- **Docker Compose** - Local database management

### Drizzle ORM Best Practices

- Define schemas using Drizzle's schema builders (`pgTable`, `serial`, `text`, etc.)
- Export type-inferred types from schemas (`InferSelectModel`, `InferInsertModel`)
- Use Drizzle's query builder for type-safe queries
- Leverage Drizzle's relations API for joins
- Use prepared statements for frequently executed queries
- Use transactions for operations that must be atomic

### Schema Design Guidelines

- Use clear, descriptive table and column names (snake_case is PostgreSQL convention)
- Define proper primary keys (prefer `serial` or `uuid`)
- Use appropriate data types (timestamp, integer, text, boolean, jsonb)
- Add NOT NULL constraints where appropriate
- Create indexes on frequently queried columns
- Use foreign keys to maintain referential integrity
- Add `createdAt` and `updatedAt` timestamps to tables
- Use JSONB for flexible document storage when appropriate

### Migration Best Practices

- Always generate migrations with `drizzle-kit generate`
- Review generated migrations before applying
- Test migrations on development data first
- Make migrations reversible when possible
- Use descriptive migration names
- Never modify existing migrations that have been deployed
- Backup database before running migrations in production

### Query Patterns

- Use Drizzle's query builder over raw SQL
- Batch database operations when possible
- Use select only the columns you need (avoid SELECT *)
- Use proper WHERE clauses to filter data efficiently
- Implement pagination with `limit()` and `offset()`
- Use joins instead of multiple queries to avoid N+1 problems
- Use Drizzle's `.prepare()` for repeated queries

### Performance Optimization

- Create indexes on columns used in WHERE, JOIN, and ORDER BY clauses
- Use partial indexes for conditional queries
- Avoid expensive operations in tight loops
- Use database-level constraints and defaults
- Use connection pooling (pg pool)
- Monitor slow queries and optimize them
- Use EXPLAIN ANALYZE to understand query performance

### Security

- Use parameterized queries (Drizzle does this automatically)
- Never concatenate user input into SQL strings
- Validate all input data with Zod before database operations
- Use least-privilege database users
- Encrypt sensitive data at rest and in transit
- Implement proper access controls in application layer
- Audit sensitive database operations

### Environment & Connection Management

- Use @chrono/env for database connection configuration
- Use environment-specific database credentials
- Implement connection pooling for better performance
- Handle connection errors gracefully
- Close connections properly on shutdown
- Use Docker Compose for local PostgreSQL instance

### Testing

- Use separate test database
- Reset database state between tests
- Seed test data consistently
- Test schema constraints and validations
- Test transactions rollback correctly
- Mock database calls in unit tests where appropriate

### Type Safety

- Export types derived from schemas using `InferSelectModel` and `InferInsertModel`
- Use these types throughout the application for consistency
- Leverage Drizzle's type inference for queries
- Define Zod schemas that match database schemas for validation

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
