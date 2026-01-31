# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Agent Skills Reference

When working on UI components, refer to the agent skills in `.agents/skills/`:

### Core Development Skills

- **Frontend Design** - Create distinctive, production-grade UIs with bold aesthetic choices
- **Composition Patterns** - Avoid boolean prop proliferation; use compound components
- **React Best Practices** - Performance optimization for re-renders, bundle size, and rendering
- **Web Interface Guidelines** - Comprehensive accessibility, forms, and interaction standards
- **Next.js Cache Components** - Next.js 16 Cache Components and PPR

### UI Quality & Fixing Skills

- **Baseline UI** - Enforces opinionated UI baseline to prevent AI-generated interface slop
- **Fixing Accessibility** - Fix accessibility issues systematically
- **Fixing Metadata** - Ship correct, complete metadata
- **Fixing Motion Performance** - Fix animation performance issues

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

## Package-Specific Guidelines: packages/ui

This package is a **shared UI component library** using React, Radix UI, and TailwindCSS.

### Key Libraries & Frameworks

- **React 19** - Component library base
- **Radix UI** - Accessible UI primitives
- **@base-ui/react** - Base UI components
- **TailwindCSS v4** - Styling system
- **class-variance-authority (CVA)** - Variant management
- **clsx/tailwind-merge** - Class name utilities
- **Lucide React** - Icon library
- **date-fns** - Date utilities
- **react-day-picker** - Date picker
- **Recharts** - Charts and data visualization
- **Sonner** - Toast notifications
- **Vaul** - Drawer component
- **cmdk** - Command menu

### Component Library Best Practices

**Composition Over Configuration:**
- Avoid boolean props for customization; use composition patterns instead
- Create explicit variant components (e.g., `<PrimaryButton>`, `<DangerButton>`) over `<Button variant="primary">`
- Use compound components for complex UI (e.g., `<Tabs><Tab /></Tabs>`)
- Use children for flexibility instead of render props
- Lift state into provider components for sibling access

**Component Design:**
- Create reusable, composable components
- Follow single responsibility principle
- Make components controllable and uncontrolled
- Provide sensible defaults
- Support ref forwarding for direct DOM access
- Export component types for TypeScript users
- Use compound component patterns where appropriate

**State Management:**
- Provider is the only place that knows how state is managed
- Define generic interface with state, actions, metadata for dependency injection
- Decouple state implementation from component interface

### Radix UI Integration

- Use Radix primitives for accessible, unstyled components
- Follow Radix's composition patterns
- Maintain accessibility features (ARIA attributes, keyboard navigation)
- Don't override Radix's accessibility features
- Use Radix's asChild prop for composition
- Follow Radix's state management patterns

### shadcn/ui Patterns

- Follow shadcn/ui component structure and naming
- Keep components in `/components/ui` directory
- Use the shadcn CLI for adding/updating components
- Customize components through TailwindCSS classes
- Maintain component consistency with shadcn conventions

### TailwindCSS v4 Styling

- Use utility-first approach
- Create design tokens with CSS variables
- Use `@apply` sparingly, prefer composition
- Leverage Tailwind's color system
- Use responsive design utilities
- Implement dark mode with `next-themes`
- Use `tailwind-merge` to resolve class conflicts
- Use CVA for component variants

### Component Variants with CVA

- Define variants for different component states/styles
- Use TypeScript for type-safe variants
- Keep variant definitions colocated with components
- Use compound variants for complex combinations
- Make variants composable

Example:
```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { sm: "...", md: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "md" }
});
```

### Accessibility Requirements

**Essential (Web Interface Guidelines):**
- All interactive elements must be keyboard accessible
- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Use semantic HTML elements before ARIA
- `<button>` for actions, `<a>`/`<Link>` for navigation (never `<div onClick>`)
- Images need `alt` (or `alt=""` if decorative)
- Decorative icons need `aria-hidden="true"`
- Async updates (toasts, validation) need `aria-live="polite"`
- Headings hierarchical `<h1>`–`<h6>`

**Focus Management:**
- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent
- Never `outline-none` without focus-visible replacement
- Use `:focus-visible` over `:focus` (avoid focus ring on click)
- Group focus with `:focus-within` for compound controls
- Maintain focus management in modals and complex interactions

**Screen Reader Support:**
- Provide proper ARIA labels and descriptions
- Support screen readers with semantic markup
- Test with accessibility tools
- Ensure proper color contrast

### Animation & Motion

**Performance (Web Interface Guidelines):**
- Honor `prefers-reduced-motion` (provide reduced variant or disable animations)
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all`—list properties explicitly
- Set correct `transform-origin`
- SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`
- Animations must be interruptible—respond to user input mid-animation

**Design:**
- Focus on high-impact moments (page load with staggered reveals using `animation-delay`)
- Use scroll-triggering and hover states that surprise
- Support reduced motion preferences for accessibility

### Theming & Design Tokens

- Use CSS custom properties for theme values
- Support light and dark modes
- Use `next-themes` for theme switching
- Define semantic color names (primary, destructive, muted, etc.)
- Make components theme-aware
- Use consistent spacing scale

### Icon Usage (Lucide React)

- Import icons individually, not the entire library
- Use consistent icon sizes
- Make icons customizable via props
- Provide accessible labels for icon-only buttons
- Use `aria-hidden` for decorative icons

### Form Components

- Use controlled or uncontrolled patterns consistently
- Provide error state handling
- Support validation feedback
- Make forms accessible (labels, error messages)
- Use `react-hook-form` compatible patterns
- Support disabled states

### Date Components (react-day-picker)

- Use date-fns for date manipulation
- Handle timezone considerations
- Support localization
- Provide accessible date pickers
- Handle invalid date states

### Data Visualization (Recharts)

- Make charts responsive
- Use consistent color schemes
- Provide tooltips for data points
- Support accessibility (labels, descriptions)
- Handle loading and error states

### Notification Components (Sonner)

- Use toast notifications consistently
- Provide different toast types (success, error, info)
- Make toasts dismissible
- Support action buttons in toasts
- Don't overuse toasts

### Component Documentation

- Document component props with JSDoc
- Provide usage examples
- Document accessibility features
- List keyboard shortcuts
- Show variant examples

### TypeScript Integration

- Export component prop types
- Use generic types for flexible components
- Provide type-safe ref forwarding
- Use discriminated unions for variant props

### Testing Components

- Test component rendering
- Test user interactions
- Test accessibility
- Test different variants
- Test edge cases and error states
- Use React Testing Library patterns

### Performance Considerations

- Lazy load heavy components
- Memoize expensive computations
- Use React.memo strategically
- Avoid unnecessary re-renders
- Optimize bundle size (tree-shaking)

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
