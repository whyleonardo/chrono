import { env } from "@chrono/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export * from "./queries/entries";
export * from "./schema/entries";

export const db = drizzle(env.DATABASE_URL, { schema });
