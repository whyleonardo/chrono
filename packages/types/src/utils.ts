/**
 * Utility types
 * Common type utilities used across the monorepo
 */

/**
 * Nullable type - makes all properties nullable
 */
export type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

/**
 * Optional type - makes all properties optional
 */
export type Optional<T> = {
	[P in keyof T]?: T[P];
};

/**
 * Deep partial type - makes all nested properties optional
 */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Prettify type - flattens complex type definitions for better readability
 */
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Strict Omit - omits keys and ensures they don't exist in the resulting type
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * Strict Pick - picks only specified keys
 */
export type StrictPick<T, K extends keyof T> = Pick<T, K>;

/**
 * Entity with timestamps
 * Common pattern for database entities
 */
export interface WithTimestamps {
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Entity with ID
 * Common pattern for database entities
 */
export interface WithId {
	id: string;
}

/**
 * Complete entity type combining common patterns
 */
export interface Entity extends WithId, WithTimestamps {}
