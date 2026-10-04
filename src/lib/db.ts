import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// One client per server process (and per hot reload in development).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
