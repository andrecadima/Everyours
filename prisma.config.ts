import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` (run on npm install) needs no database, so the URL is only
// required by commands that connect: migrate, seed, studio.
const url = process.env.DATABASE_URL;
