/**
 * Seeds DEMONSTRATION data.
 * Coordinates were checked against OpenStreetMap so no outline crosses a road,
 * river, building, or protected area, and each sits near a road. Every development name, lot, price, and coordinate
 * below is fictional and flagged `isDemo`. Photos are real images of the
 * Santa Cruz region used as illustrations, with their licences recorded.
 *
 * To load real inventory later, create Property rows with `isDemo: false` and
 * their surveyed coordinates; nothing else in the app needs to change.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  type PropertyStatus,
  type RoadAccess,
  type Terrain,
  type Utility,
} from "../src/generated/prisma/client";
import credits from "./data/image-credits.json";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type PhotoSlug = keyof typeof credits;
