import type { Auth } from "@chrono/auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient<Auth>({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3001",
});

// Export commonly used methods for convenience
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
