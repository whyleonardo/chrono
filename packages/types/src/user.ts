import { z } from "zod";

/**
 * User model
 * Mirrors the database schema from @chrono/db
 */
export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Session model for authentication
 */
export interface Session {
	id: string;
	expiresAt: Date;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	ipAddress: string | null;
	userAgent: string | null;
	userId: string;
}

/**
 * Account model for OAuth providers
 */
export interface Account {
	id: string;
	accountId: string;
	providerId: string;
	userId: string;
	accessToken: string | null;
	refreshToken: string | null;
	idToken: string | null;
	accessTokenExpiresAt: Date | null;
	refreshTokenExpiresAt: Date | null;
	scope: string | null;
	password: string | null;
	createdAt: Date;
	updatedAt: Date;
}

// Zod schemas for validation
export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const SessionSchema = z.object({
	id: z.string(),
	expiresAt: z.date(),
	token: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	userId: z.string(),
});

export const AccountSchema = z.object({
	id: z.string(),
	accountId: z.string(),
	providerId: z.string(),
	userId: z.string(),
	accessToken: z.string().nullable(),
	refreshToken: z.string().nullable(),
	idToken: z.string().nullable(),
	accessTokenExpiresAt: z.date().nullable(),
	refreshTokenExpiresAt: z.date().nullable(),
	scope: z.string().nullable(),
	password: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Type inference from schemas
export type UserFromSchema = z.infer<typeof UserSchema>;
export type SessionFromSchema = z.infer<typeof SessionSchema>;
export type AccountFromSchema = z.infer<typeof AccountSchema>;
