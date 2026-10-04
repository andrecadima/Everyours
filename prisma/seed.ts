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

const PHOTO_ALT: Record<PhotoSlug, string> = {
  "piray-aerial": "Aerial view of the Piraí river winding through green forest between Santa Cruz and Porongo",
  "piray-tree": "A broad shade tree on the bank of the Piraí river under a pale sky",
  "volcan-meadow": "Bright green meadow below forested cliffs in the Amboró foothills",
  "volcan-valley": "A wide green valley framed by forested ridges in the Amboró foothills",
  "volcan-lake": "A calm lagoon surrounded by green hills and flowering trees",
  "volcan-lake-2": "Green pasture running down to a lagoon beneath rounded hills",
  "eltorno-view": "Panoramic view over El Torno toward the first ridges of the Andes",
  "acuri-palm": "A motacú palm standing alone in open grassland",
  "motacu-grove": "A grove of tall motacú palms in open subtropical woodland",
  "motacu-palm": "A large motacú palm with arching fronds in a grassy clearing",
  "turubo-aerial": "Aerial view of flat Chiquitano woodland stretching to the horizon",
  "riogrande-hills": "Low green hills above the Río Grande valley",
  "surutu-sunset": "Sunset reflected on the Surutú river with silhouetted forest",
  "volcanes-ridge": "Sandstone ridges and green forest in the Serranía de los Volcanes",
  "lomas-landscape": "Open landscape of sand hills and green scrub at Lomas de Arena",
  "lomas-lagoon": "A sandy shore and lagoon at Lomas de Arena on a clear day",
  "samaipata-valley": "A tree framing a view across the Samaipata valley",
  "samaipata-hills": "Layered green mountains seen from the hills of Samaipata",
  "amboro-tajibo": "Forested slopes in Amboró with pink tajibo trees in bloom",
  "amboro-hills": "Rolling forested hills in the Amboró region",
  "amboro-vista": "Wide view over rolling hills and forest in Amboró",
  "tajibo-tree": "A pink tajibo tree in full bloom in an open field",
};
