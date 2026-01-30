/**
 * API Response types
 * Common response structures for API endpoints
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
	data: T;
	success: boolean;
	message?: string;
}

/**
 * API error response
 */
export interface ApiError {
	success: false;
	error: {
		code: string;
		message: string;
		details?: Record<string, string[]>;
	};
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
	meta: PaginationMeta;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
	status: "ok" | "error";
	timestamp: string;
	version?: string;
}
