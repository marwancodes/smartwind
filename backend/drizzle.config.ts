/// <reference types="node" />
//this reference is necessary for the "process" global variable to be recognized in this file since we're using ESNext module system and targetting ES2024, which includes the "process" global variable as part of the standard library. Without this reference, TypeScript would not recognize "process" and would throw an error.

import { defineConfig } from "drizzle-kit";
import "dotenv/config";


export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? ""
    }
});