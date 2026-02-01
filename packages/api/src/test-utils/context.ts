/**
 * Test utilities for creating mock authentication contexts
 * Bypasses actual Better-Auth session validation for unit tests
 */

export interface AuthContext {
	session: {
		session: {
			id: string;
			createdAt: Date;
			updatedAt: Date;
			userId: string;
			expiresAt: Date;
			token: string;
			ipAddress?: string | null;
			userAgent?: string | null;
		};
		user: {
			id: string;
			createdAt: Date;
			updatedAt: Date;
			email: string;
			emailVerified: boolean;
			name: string;
			image?: string | null;
		};
	} | null;
}

/**
 * Creates a mock authentication context for testing
 */
export function createMockContext(
	userId = "test-user-api",
	email = "test-api@example.com",
	name = "Test User"
): AuthContext {
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

	return {
		session: {
			session: {
				id: crypto.randomUUID(),
				createdAt: now,
				updatedAt: now,
				userId,
				expiresAt,
				token: "mock-token",
			},
			user: {
				id: userId,
				createdAt: now,
				updatedAt: now,
				email,
				emailVerified: true,
				name,
			},
		},
	};
}

/**
 * Creates a mock context for a different user (for testing authorization)
 */
export function createMockOtherUserContext(
	userId = "other-user-api",
	email = "other@example.com",
	name = "Other User"
): AuthContext {
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

	return {
		session: {
			session: {
				id: crypto.randomUUID(),
				createdAt: now,
				updatedAt: now,
				userId,
				expiresAt,
				token: "mock-token-other",
			},
			user: {
				id: userId,
				createdAt: now,
				updatedAt: now,
				email,
				emailVerified: true,
				name,
			},
		},
	};
}
