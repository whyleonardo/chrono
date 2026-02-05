# Auth Forms Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance signin and signup forms with toast notifications, password visibility toggle, email input with icon, animated arrow button, and automatic redirect on signup success.

**Architecture:** Create three reusable UI components (PasswordInput, EmailInput, AnimatedArrowButton) leveraging existing @chrono/ui InputGroup and Button primitives. Update auth forms to use new components, add Sonner toast feedback, and implement programmatic redirect on signup success.

**Tech Stack:** React, Next.js App Router, Better-Auth, motion/react, Sonner toasts, Lucide icons, InputGroup/Button primitives

---

## Task 1: Create PasswordInput Component

**Files:**
- Create: `packages/ui/src/components/password-input.tsx`

**Step 1: Write the PasswordInput component**

```tsx
"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@chrono/ui/components/input-group";

interface PasswordInputProps
	extends Omit<ComponentProps<typeof InputGroupInput>, "type"> {
	showToggle?: boolean;
}

function PasswordInput({
	showToggle = true,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<InputGroup>
			<InputGroupInput
				type={showPassword ? "text" : "password"}
				{...props}
			/>
			{showToggle && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="button"
						variant="ghost"
						size="xs"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? (
							<EyeOffIcon aria-hidden="true" />
						) : (
							<EyeIcon aria-hidden="true" />
						)}
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

export { PasswordInput };
```

**Step 2: Verify component compiles**

Run: `bun run check-types`

Expected: No type errors for password-input.tsx

**Step 3: Run linting**

Run: `bun run fix`

Expected: Code formatted, no errors

**Step 4: Commit**

```bash
git add packages/ui/src/components/password-input.tsx
git commit -m "feat(ui): add password input with visibility toggle"
```

---

## Task 2: Create EmailInput Component

**Files:**
- Create: `packages/ui/src/components/email-input.tsx`

**Step 1: Write the EmailInput component**

```tsx
"use client";

import type { ComponentProps } from "react";
import { MailIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@chrono/ui/components/input-group";

interface EmailInputProps
	extends Omit<ComponentProps<typeof InputGroupInput>, "type"> {
	showIcon?: boolean;
}

function EmailInput({ showIcon = true, ...props }: EmailInputProps) {
	return (
		<InputGroup>
			<InputGroupInput type="email" {...props} />
			{showIcon && (
				<InputGroupAddon align="inline-end">
					<InputGroupText>
						<MailIcon aria-hidden="true" />
					</InputGroupText>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

export { EmailInput };
```

**Step 2: Verify component compiles**

Run: `bun run check-types`

Expected: No type errors for email-input.tsx

**Step 3: Run linting**

Run: `bun run fix`

Expected: Code formatted, no errors

**Step 4: Commit**

```bash
git add packages/ui/src/components/email-input.tsx
git commit -m "feat(ui): add email input with mail icon"
```

---

## Task 3: Create AnimatedArrowButton Component

**Files:**
- Create: `packages/ui/src/components/animated-arrow-button.tsx`

**Step 1: Write the AnimatedArrowButton component**

```tsx
"use client";

import type { ComponentProps } from "react";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@chrono/ui/components/button";
import { cn } from "@chrono/ui/lib/utils";

interface AnimatedArrowButtonProps extends ComponentProps<typeof Button> {
	children: React.ReactNode;
}

function AnimatedArrowButton({
	children,
	className,
	...props
}: AnimatedArrowButtonProps) {
	return (
		<Button
			className={cn("group/arrow-btn gap-2 overflow-hidden", className)}
			{...props}
		>
			{children}
			<motion.span
				className="inline-flex"
				initial={{ x: 0 }}
				whileHover={{ x: 4 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
			>
				<ArrowRightIcon aria-hidden="true" className="size-4" />
			</motion.span>
		</Button>
	);
}

export { AnimatedArrowButton };
```

**Step 2: Verify component compiles**

Run: `bun run check-types`

Expected: No type errors for animated-arrow-button.tsx

**Step 3: Run linting**

Run: `bun run fix`

Expected: Code formatted, no errors

**Step 4: Commit**

```bash
git add packages/ui/src/components/animated-arrow-button.tsx
git commit -m "feat(ui): add button with animated arrow on hover"
```

---

## Task 4: Update SignIn Form with Enhanced Components and Toast

**Files:**
- Modify: `apps/web/src/app/(auth)/signin/_components/signin-form.tsx`

**Step 1: Read the current file**

Read the entire signin-form.tsx to understand current structure.

**Step 2: Update imports**

Replace the imports section at the top with:

```tsx
"use client";

import { AnimatedArrowButton } from "@chrono/ui/components/animated-arrow-button";
import { EmailInput } from "@chrono/ui/components/email-input";
import { PasswordInput } from "@chrono/ui/components/password-input";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
```

**Step 3: Add router hook**

Add this after useState declarations:

```tsx
const router = useRouter();
```

**Step 4: Update handleSubmit function**

Replace the existing handleSubmit with:

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	setIsLoading(true);

	const { error } = await signIn.email({
		email,
		password,
		callbackURL: "/dashboard",
	});

	setIsLoading(false);

	if (error) {
		toast.error("Sign in failed", {
			description: error.message || "Invalid email or password. Please try again.",
		});
		return;
	}

	toast.success("Welcome back!", {
		description: "You have been signed in successfully.",
	});
	router.push("/dashboard");
};
```

**Step 5: Replace email input field**

Replace the email input section (the entire div with label and input) with:

```tsx
<div>
	<label
		className="mb-2 block text-muted-foreground text-sm"
		htmlFor="email"
	>
		Email
	</label>
	<EmailInput
		id="email"
		value={email}
		onChange={(e) => setEmail(e.target.value)}
		placeholder="you@example.com"
		autoComplete="email"
		required
	/>
</div>
```

**Step 6: Replace password input field**

Replace the password input section (the entire div with label and input) with:

```tsx
<div>
	<label
		className="mb-2 block text-muted-foreground text-sm"
		htmlFor="password"
	>
		Password
	</label>
	<PasswordInput
		id="password"
		value={password}
		onChange={(e) => setPassword(e.target.value)}
		placeholder="••••••••"
		autoComplete="current-password"
		required
	/>
</div>
```

**Step 7: Replace submit button**

Replace the entire motion.button (the submit button) with:

```tsx
<AnimatedArrowButton
	type="submit"
	disabled={isLoading}
	className="h-11 w-full"
>
	{isLoading ? (
		<motion.div
			animate={{ rotate: 360 }}
			className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
			transition={{
				duration: 1,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		/>
	) : (
		<span>Sign In</span>
	)}
</AnimatedArrowButton>
```

**Step 8: Verify changes compile**

Run: `bun run check-types`

Expected: PASS with no type errors

**Step 9: Run linting**

Run: `bun run fix`

Expected: Code formatted with no errors

**Step 10: Commit**

```bash
git add apps/web/src/app/(auth)/signin/_components/signin-form.tsx
git commit -m "feat(auth): enhance signin form with improved inputs, animated button, and toast feedback"
```

---

## Task 5: Update SignUp Form with Enhanced Components, Toast, and Redirect

**Files:**
- Modify: `apps/web/src/app/(auth)/signup/_components/signup-form.tsx`

**Step 1: Read the current file**

Read the entire signup-form.tsx to understand current structure.

**Step 2: Update imports**

Replace the imports section at the top with:

```tsx
"use client";

import { AnimatedArrowButton } from "@chrono/ui/components/animated-arrow-button";
import { EmailInput } from "@chrono/ui/components/email-input";
import { PasswordInput } from "@chrono/ui/components/password-input";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
```

**Step 3: Add router hook and update state**

After the imports and function declaration, update state to:

```tsx
const router = useRouter();
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
```

Remove the old `error` state if it exists.

**Step 4: Replace handleSubmit function**

Replace the entire handleSubmit function with:

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();

	if (password !== confirmPassword) {
		toast.error("Passwords don't match", {
			description: "Please make sure your passwords match.",
		});
		return;
	}

	if (!name.trim()) {
		toast.error("Name required", {
			description: "Please enter your name to continue.",
		});
		return;
	}

	if (password.length < 8) {
		toast.error("Password too short", {
			description: "Password must be at least 8 characters long.",
		});
		return;
	}

	setIsLoading(true);

	const { error } = await signUp.email({
		email,
		password,
		name,
		callbackURL: "/dashboard",
	});

	setIsLoading(false);

	if (error) {
		toast.error("Sign up failed", {
			description: error.message || "Unable to create account. Please try again.",
		});
		return;
	}

	toast.success("Account created!", {
		description: "Welcome to Chrono. Redirecting to your dashboard...",
	});
	router.push("/dashboard");
};
```

**Step 5: Remove error state display**

Remove the error message JSX block that displays errors (the motion.div that shows error styling).

**Step 6: Replace name input field**

Replace the name input section with:

```tsx
<div>
	<label
		className="mb-2 block text-muted-foreground text-sm"
		htmlFor="name"
	>
		Name
	</label>
	<input
		className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
		id="name"
		onChange={(e) => setName(e.target.value)}
		placeholder="Your name"
		required
		type="text"
		value={name}
	/>
</div>
```

**Step 7: Replace email input field**

Replace the email input section with:

```tsx
<div>
	<label
		className="mb-2 block text-muted-foreground text-sm"
		htmlFor="email"
	>
		Email
	</label>
	<EmailInput
		id="email"
		value={email}
		onChange={(e) => setEmail(e.target.value)}
		placeholder="you@example.com"
		autoComplete="email"
		required
	/>
</div>
```

**Step 8: Replace password input field**

Replace the password input section with:

```tsx
<div>
	<label
		className="mb-2 block text-muted-foreground text-sm"
		htmlFor="password"
	>
		Password
	</label>
	<PasswordInput
		id="password"
		value={password}
		onChange={(e) => setPassword(e.target.value)}
		placeholder="••••••••"
		autoComplete="new-password"
		required
	/>
</div>
```

**Step 9: Replace confirm password input field**

Replace the confirmPassword input section with:

```tsx
<div>
	<label
		className="mb-2 block text-muted-foreground text-sm"
		htmlFor="confirmPassword"
	>
		Confirm Password
	</label>
	<PasswordInput
		id="confirmPassword"
		value={confirmPassword}
		onChange={(e) => setConfirmPassword(e.target.value)}
		placeholder="••••••••"
		autoComplete="new-password"
		required
	/>
</div>
```

**Step 10: Replace submit button**

Replace the entire motion.button (the submit button) with:

```tsx
<AnimatedArrowButton
	type="submit"
	disabled={isLoading}
	className="h-11 w-full"
>
	{isLoading ? (
		<motion.div
			animate={{ rotate: 360 }}
			className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
			transition={{
				duration: 1,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		/>
	) : (
		<span>Create Account</span>
	)}
</AnimatedArrowButton>
```

**Step 11: Verify changes compile**

Run: `bun run check-types`

Expected: PASS with no type errors

**Step 12: Run linting**

Run: `bun run fix`

Expected: Code formatted with no errors

**Step 13: Commit**

```bash
git add apps/web/src/app/(auth)/signup/_components/signup-form.tsx
git commit -m "feat(auth): enhance signup form with improved inputs, animated button, toast feedback, and auto-redirect"
```

---

## Task 6: Verify Full Type Safety and Build

**Files:**
- All modified and created files

**Step 1: Run type check**

Run: `bun run check-types`

Expected: PASS - All files type-safe

**Step 2: Run full lint check**

Run: `bun run check`

Expected: PASS - No linting issues

**Step 3: Run build**

Run: `bun run build`

Expected: PASS - Project builds successfully

**Step 4: Final status check**

Run: `git status`

Expected: All changes committed, working tree clean

---

## Testing Checklist

### Signin Form Tests

1. Navigate to `/signin`
2. Verify email input displays mail icon on the right
3. Verify password input displays eye icon
4. Click eye icon to toggle password visibility
5. Hover over "Sign In" button - arrow should animate right
6. Try signing in with invalid email - should show error toast
7. Try signing in with incorrect password - should show error toast
8. Sign in with valid credentials - should show success toast and redirect to `/dashboard`

### Signup Form Tests

1. Navigate to `/signup`
2. Verify email input displays mail icon on the right
3. Verify both password inputs display eye icons
4. Toggle visibility on both password fields
5. Hover over "Create Account" button - arrow should animate right
6. Submit with empty name - should show error toast
7. Submit with mismatched passwords - should show error toast
8. Submit with password < 8 chars - should show error toast
9. Submit with valid data - should show success toast and redirect to `/dashboard`

### Visual Verification

- Toast notifications appear in bottom-right corner
- Toast messages are clear and helpful
- Password visibility toggle works smoothly
- Email icon is visible and properly aligned
- Arrow animation on button hover is smooth
- Form validation happens before API call
- Loading spinner shows during submission

---

## Summary of Changes

**Created (3 files):**
- `packages/ui/src/components/password-input.tsx` - Reusable password input with eye toggle
- `packages/ui/src/components/email-input.tsx` - Reusable email input with mail icon
- `packages/ui/src/components/animated-arrow-button.tsx` - Button with animated arrow on hover

**Modified (2 files):**
- `apps/web/src/app/(auth)/signin/_components/signin-form.tsx` - Added new components, toast feedback, proper error handling
- `apps/web/src/app/(auth)/signup/_components/signup-form.tsx` - Added new components, toast feedback, validation, auto-redirect to dashboard

**Features Added:**
- ✅ Password visibility toggle with eye/eye-off icons
- ✅ Email input with mail icon indicator
- ✅ Animated arrow button that moves on hover
- ✅ Toast notifications for success/error feedback
- ✅ Form validation with user-friendly error messages
- ✅ Automatic redirect to `/dashboard` on successful signup
- ✅ Better error messaging with specific validation feedback
- ✅ Improved accessibility with proper ARIA labels

**No External Dependencies Added** - Uses existing libraries:
- motion/react (already in project)
- sonner (already configured)
- @chrono/ui components (already in project)
- lucide-react icons (already in project)
