# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Agent Skills Reference

When working on frontend code, refer to the agent skills in `.opencode/skills/`:

- **Frontend Design** - Create distinctive, production-grade UIs avoiding generic aesthetics
- **Composition Patterns** - Build scalable React components with proper composition
- **React Best Practices** - 57 performance optimization rules (waterfalls, bundle size, re-renders)
- **Web Interface Guidelines** - Accessibility, forms, animation, typography, and UX standards

**Skills take precedence** when they conflict with guidelines below.

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

## Package-Specific Guidelines: apps/web

This is the main **Next.js 15+ App Router** application with full-stack capabilities.

### Key Libraries & Frameworks

- **Next.js App Router** - Server/Client Components, Server Actions
- **React 19** - Latest React with new features
- **ORPC** - Type-safe API client and server
- **Better-Auth** - Authentication
- **TanStack Query** - Server state management
- **TanStack Form** - Form state management
- **Zod** - Schema validation
- **TailwindCSS v4** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible UI primitives

### Next.js App Router Best Practices

- Use Server Components by default, Client Components only when needed (interactivity, hooks, browser APIs)
- Mark Client Components with `"use client"` directive at the top of the file
- Fetch data in Server Components using async/await, not in Client Components with useEffect
- Use Server Actions for mutations with `"use server"` directive
- Leverage React Server Components for better performance and smaller bundle sizes
- Use `<Link>` from `next/link` for navigation, not `<a>` tags
- Optimize images with `next/image` `<Image>` component
- Use proper metadata API for SEO (generateMetadata, metadata object)

### ORPC Guidelines

- Define type-safe API endpoints using ORPC schemas
- Use ORPC client hooks with TanStack Query for data fetching
- Leverage automatic type inference between client and server
- Handle errors consistently using ORPC error types
- Use Zod schemas for request/response validation

### Authentication (Better-Auth)

- Use Better-Auth hooks and utilities for authentication state
- Protect routes with proper authentication middleware
- Handle session management according to Better-Auth patterns
- Secure API routes with authentication checks

### TanStack Query Best Practices

- Use query keys consistently and hierarchically
- Implement proper cache invalidation strategies
- Use mutations with onSuccess/onError callbacks
- Leverage optimistic updates for better UX
- Use suspense boundaries for loading states where appropriate

### TanStack Form Guidelines

- Define form schemas with Zod validation
- Use type-safe form fields with proper TypeScript types
- Implement proper error handling and display
- Leverage controlled form state management

### TailwindCSS v4 & Styling

- Use Tailwind utility classes, avoid custom CSS when possible
- Use `clsx` or `cn` utility for conditional classes
- Follow TailwindCSS v4 configuration patterns
- Use CSS variables for theming (next-themes)
- Prefer `tailwind-merge` for merging conflicting classes

### shadcn/ui & Radix UI Components

- Use shadcn/ui components as building blocks
- Customize components in `/components/ui` directory
- Follow Radix UI accessibility patterns
- Use Radix primitives for headless UI components
- Ensure keyboard navigation and ARIA attributes are preserved

### Date & Time Handling

- Use `date-fns` for date manipulation and formatting
- Use `react-day-picker` for date picker components
- Handle timezones correctly
- Format dates consistently across the application

### Frontend Design Principles

When creating UI components, pages, or interfaces:

**Design Thinking:**
- Understand purpose: What problem does this solve? Who uses it?
- Choose a bold aesthetic direction: minimal, maximalist, retro-futuristic, luxury, playful, editorial, brutalist, etc.
- Define differentiation: What makes this interface memorable?

**Aesthetics:**
- **Typography**: Avoid generic fonts (Inter, Roboto, Arial). Choose distinctive, characterful font pairings
- **Color & Theme**: Use CSS variables. Dominant colors with sharp accents > evenly-distributed palettes
- **Motion**: Use animations for high-impact moments. Focus on page load reveals with staggered `animation-delay`
- **Spatial Composition**: Embrace asymmetry, overlap, diagonal flow, generous negative space, or controlled density
- **Visual Details**: Create depth with gradient meshes, noise textures, geometric patterns, layered transparencies

**Never:**
- Use overused fonts (Inter, Roboto, Arial, system fonts)
- Use cliched color schemes (purple gradients on white backgrounds)
- Create predictable, cookie-cutter layouts
- Converge on common choices (e.g., Space Grotesk)

**Match complexity to vision**: Maximalist designs need elaborate code; minimalist designs need restraint and precision.

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
