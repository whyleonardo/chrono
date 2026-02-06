import { describe, expect, it } from "vitest";
import { parseCorsOrigins } from "./cors";

describe("parseCorsOrigins", () => {
	it("parses a single origin", () => {
		expect(parseCorsOrigins("http://localhost:3001")).toEqual([
			"http://localhost:3001",
		]);
	});

	it("parses comma-separated origins", () => {
		expect(
			parseCorsOrigins(
				"http://localhost:3001,https://random-subdomain.trycloudflare.com"
			)
		).toEqual([
			"http://localhost:3001",
			"https://random-subdomain.trycloudflare.com",
		]);
	});

	it("trims whitespace around origins", () => {
		expect(
			parseCorsOrigins("http://localhost:3001 , https://example.com")
		).toEqual(["http://localhost:3001", "https://example.com"]);
	});

	it("filters out empty strings", () => {
		expect(parseCorsOrigins("http://localhost:3001,,")).toEqual([
			"http://localhost:3001",
		]);
	});
});
