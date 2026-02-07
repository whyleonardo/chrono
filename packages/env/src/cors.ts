/**
 * Parses a comma-separated string of origins into an array.
 * Trims whitespace and filters empty strings.
 */
export function parseCorsOrigins(origins: string): string[] {
	return origins
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
}
