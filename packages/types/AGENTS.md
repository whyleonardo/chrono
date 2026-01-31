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

## Package-Specific Guidelines: packages/types

This package contains **shared TypeScript types and Zod schemas** used across the monorepo.

### Key Libraries & Frameworks

- **TypeScript** - Type definitions
- **Zod** - Runtime validation schemas

### Purpose & Scope

- Define shared types used by multiple packages
- Create reusable Zod schemas for validation
- Maintain type consistency across the monorepo
- Provide domain models and business entities
- Export utility types and type helpers

### TypeScript Type Best Practices

- Use interfaces for object shapes that might be extended
- Use types for unions, intersections, and complex type logic
- Create specific, focused types - avoid overly generic types
- Use discriminated unions for polymorphic types
- Leverage utility types (`Pick`, `Omit`, `Partial`, `Required`)
- Document complex types with JSDoc comments
- Export types explicitly, don't rely on implicit exports

### Type Organization

- Group related types together in files
- Use clear, descriptive type names (PascalCase)
- Create type aliases for complex type expressions
- Use namespaces sparingly, prefer modules
- Organize by domain/feature rather than by kind
- Keep type files focused and single-purpose

### Zod Schema Guidelines

- Define Zod schemas alongside or instead of raw TypeScript types
- Use `.brand()` or `.transform()` for branded types
- Leverage Zod's type inference (`z.infer<typeof schema>`)
- Create schema compositions for reusability
- Use `.strict()` to prevent unexpected properties
- Use `.describe()` to add documentation to schemas

### Type Safety Patterns

- Use `const` assertions for literal types
- Leverage template literal types for string patterns
- Use `satisfies` operator for type checking without widening
- Create type guards for runtime type checking
- Use `unknown` for truly unknown types, not `any`
- Make illegal states unrepresentable with proper types

### Shared Domain Models

- Define core business entities (User, Product, Order, etc.)
- Keep domain models separate from database models
- Use Zod schemas for input validation
- Export both the schema and inferred type
- Version types if they change over time

### Schema Composition

- Create base schemas that can be extended
- Use `.merge()` to combine schemas
- Use `.pick()` and `.omit()` for schema subsets
- Create schemas for common patterns (pagination, sorting, filtering)
- Share validation logic across API and UI

### Type vs Schema Considerations

When to use TypeScript types:
- Pure compile-time type checking
- Type manipulation and utilities
- When no runtime validation needed

When to use Zod schemas:
- Validating external input (API requests, form data)
- Runtime type checking
- Type inference for validated data
- Documentation and error messages

### Common Patterns

```typescript
// Schema with inferred type
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
});
export type User = z.infer<typeof userSchema>;

// Pick/Omit for variations
export const createUserSchema = userSchema.omit({ id: true });
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Partial for updates
export const updateUserSchema = userSchema.partial();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### Utility Types

- Create reusable utility types for common patterns
- Paginated response types
- API response wrappers (success, error)
- Filter and sort types
- ID types (branded strings)

### Versioning & Evolution

- Plan for type evolution over time
- Use versioned types for breaking changes
- Deprecate old types gradually
- Document migration paths
- Consider backwards compatibility

### Documentation

- Use JSDoc comments for complex types
- Document generic parameters
- Explain non-obvious type constraints
- Provide usage examples for complex types
- Document the relationship between related types

### Testing Types

**Test Framework:** Vitest

- Import test utilities from `vitest` (`describe`, `it`, `expect`)
- Use TypeScript's type system for type tests
- Verify type inference works correctly
- Test Zod schema validation
- Ensure schema and type stay in sync
- Run tests with: `vitest run`

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
