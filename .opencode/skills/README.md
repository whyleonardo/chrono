# Agent Skills

This directory contains agent skills that guide AI agents in producing high-quality code following best practices for frontend development, React/Next.js optimization, and web interface design.

## Skills Overview

### 1. Anthropic Frontend Design
**File**: `anthropic-frontend-design.md`

Guidelines for creating distinctive, production-grade frontend interfaces with exceptional aesthetic quality. Focuses on:
- Bold aesthetic direction and intentional design choices
- Typography, color, motion, and spatial composition
- Avoiding generic AI-generated aesthetics
- Matching implementation complexity to design vision

**Source**: [Anthropic Skills - Frontend Design](https://raw.githubusercontent.com/anthropics/skills/refs/heads/main/skills/frontend-design/SKILL.md)

### 2. Vercel Composition Patterns
**File**: `vercel-composition-patterns.md`

React composition patterns for building flexible, maintainable components. Covers:
- Avoiding boolean prop proliferation
- Compound components and context providers
- State management patterns
- React 19 API updates

**Source**: [Vercel Agent Skills - Composition Patterns](https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns)

### 3. Vercel React Best Practices
**File**: `vercel-react-best-practices.md`

Comprehensive performance optimization guide with 57 rules across 8 priority categories:
- Eliminating waterfalls (CRITICAL)
- Bundle size optimization (CRITICAL)
- Server-side performance (HIGH)
- Client-side data fetching (MEDIUM-HIGH)
- Re-render optimization (MEDIUM)
- Rendering performance (MEDIUM)
- JavaScript performance (LOW-MEDIUM)
- Advanced patterns (LOW)

**Source**: [Vercel Agent Skills - React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

### 4. Vercel Web Design Guidelines
**File**: `vercel-web-design-guidelines.md`

Web interface guidelines covering standards and best practices for:
- Accessibility (ARIA, semantic HTML, keyboard navigation)
- Focus states and form handling
- Animation and typography
- Performance and image optimization
- Dark mode, i18n, and hydration safety
- Touch interactions and safe areas

**Source**: [Vercel Agent Skills - Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines)

## Attribution

### Vercel Agent Skills

The Vercel skills in this directory are based on the [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) repository, which provides a collection of reusable, best-practice guidelines for AI coding agents.

**Repository**: https://github.com/vercel-labs/agent-skills
**License**: MIT

### Anthropic Skills

The Anthropic Frontend Design skill is based on Anthropic's official skills repository.

**Repository**: https://github.com/anthropics/skills
**Skill**: [Frontend Design](https://raw.githubusercontent.com/anthropics/skills/refs/heads/main/skills/frontend-design/SKILL.md)

## Usage

These skills are referenced by AI agents working on the Chrono codebase to ensure consistent, high-quality output that follows industry best practices. The guidelines in these skills take precedence over conflicting recommendations in other documentation when working on frontend code, React components, or UI/UX improvements.

## Integration with AGENTS.md

Key principles and rules from these skills have been integrated into the various `AGENTS.md` files throughout the codebase:
- Root `AGENTS.md` - General development guidelines
- `apps/web/AGENTS.md` - Next.js App Router and frontend specifics
- `packages/ui/AGENTS.md` - UI component development
- Other package-specific `AGENTS.md` files

When conflicts arise between existing guidelines and these skills, the skill guidelines take precedence as they represent the most current and comprehensive best practices.
