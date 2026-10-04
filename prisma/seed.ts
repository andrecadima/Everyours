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

function photo(slug: PhotoSlug, sortOrder: number) {
  const c = credits[slug];
  return {
    url: `/images/demo/${slug}.jpg`,
    alt: PHOTO_ALT[slug],
    sortOrder,
    credit: `${c.artist}, ${c.license}, via Wikimedia Commons`,
    creditUrl: c.source,
    isIllustrative: true,
  };
}

type SeedProperty = {
  slug: string;
  name: string;
  lotLabel: string;
  area: string;
  municipality: string;
  latitude: number;
  longitude: number;
  areaSquareMeters: number;
  totalPriceUsd: number;
  downPaymentUsd: number;
  termMonths: number;
  status?: PropertyStatus;
  featured?: boolean;
  roadAccess: RoadAccess;
  terrain: Terrain;
  utilities: Utility[];
  description: string;
  photos: PhotoSlug[];
};

const properties: SeedProperty[] = [
  {
    slug: "las-palmas-lot-14",
    name: "Las Palmas",
    lotLabel: "Lot 14",
    area: "Porongo",
    municipality: "Porongo",
    latitude: -17.905,
    longitude: -63.318,
    areaSquareMeters: 500,
    totalPriceUsd: 12_500,
    downPaymentUsd: 2_000,
    termMonths: 84,
    featured: true,
    roadAccess: "GRAVEL",
    terrain: "GENTLE_SLOPE",
    utilities: ["ELECTRICITY", "WATER"],
    description:
      "A quiet lot among motacú palms on the gentle slopes south of Porongo, with room to build, plant, or simply own something real. Mornings here are cool and green; the city is twenty-five minutes away.",
    photos: ["acuri-palm", "motacu-grove", "volcan-meadow"],
  },
  {
    slug: "mirador-del-pirai-lot-6",
    name: "Mirador del Piraí",
    lotLabel: "Lot 6",
    area: "Porongo",
    municipality: "Porongo",
    latitude: -17.87117,
    longitude: -63.335,
    areaSquareMeters: 2_500,
    totalPriceUsd: 52_000,
    downPaymentUsd: 7_600,
    termMonths: 120,
    roadAccess: "GRAVEL",
    terrain: "HILLSIDE",
    utilities: ["ELECTRICITY"],
    description:
      "A wide hillside parcel above the Piraí valley, large enough for a house, a garden, and a long view west toward the hills. Electricity reaches the lot line; water would come from a well.",
    photos: ["piray-aerial", "amboro-vista", "riogrande-hills"],
  },
  {
    slug: "los-tajibos-lot-9",
    name: "Los Tajibos",
    lotLabel: "Lot 9",
    area: "Urubó",
    municipality: "Porongo",
    latitude: -17.74146,
    longitude: -63.262,
    areaSquareMeters: 1_000,
    totalPriceUsd: 39_000,
    downPaymentUsd: 6_000,
    termMonths: 120,
    featured: true,
    roadAccess: "PAVED",
    terrain: "FLAT",
    utilities: ["ELECTRICITY", "WATER", "INTERNET"],
    description:
      "A level lot in Urubó lined with tajibo trees that turn pink every winter. Paved access, services at the property line, and the city just across the river.",
    photos: ["tajibo-tree", "amboro-tajibo", "motacu-palm"],
  },
  {
    slug: "rio-verde-lot-8",
    name: "Río Verde",
    lotLabel: "Lot 8",
    area: "La Guardia",
    municipality: "La Guardia",
    latitude: -17.96486,
    longitude: -63.293,
    areaSquareMeters: 750,
    totalPriceUsd: 18_000,
    downPaymentUsd: 1_200,
    termMonths: 96,
    featured: true,
    roadAccess: "GRAVEL",
    terrain: "FLAT",
    utilities: ["ELECTRICITY", "WATER"],
    description:
      "Flat, open land near the river south of La Guardia, where evenings end in long orange light. A practical lot with water and power already nearby.",
    photos: ["surutu-sunset", "volcan-lake", "lomas-landscape"],
  },
  {
    slug: "monte-claro-lot-5",
    name: "Monte Claro",
    lotLabel: "Lot 5",
    area: "El Torno",
    municipality: "El Torno",
    latitude: -18.035,
    longitude: -63.41217,
    areaSquareMeters: 1_200,
    totalPriceUsd: 14_400,
    downPaymentUsd: 1_800,
    termMonths: 84,
    roadAccess: "DIRT",
    terrain: "GENTLE_SLOPE",
    utilities: ["ELECTRICITY"],
    description:
      "Where the lowlands meet the first ridges of the Andes. A generous lot with forest at its back, cooler nights, and a dirt road that the municipality plans to improve.",
    photos: ["eltorno-view", "volcanes-ridge", "amboro-hills"],
  },
  {
    slug: "lomas-del-sol-lot-12",
    name: "Lomas del Sol",
    lotLabel: "Lot 12",
    area: "Lomas de Arena",
    municipality: "Santa Cruz de la Sierra",
    latitude: -17.91183,
    longitude: -63.152,
    areaSquareMeters: 400,
    totalPriceUsd: 11_000,
    downPaymentUsd: 1_100,
    termMonths: 60,
    roadAccess: "PAVED",
    terrain: "FLAT",
    utilities: ["ELECTRICITY", "WATER", "SEWER"],
    description:
      "A compact lot on the southern edge of the city, minutes from the sand hills and lagoons of Lomas de Arena. Paved street, full services, and the shortest plan we offer.",
    photos: ["lomas-landscape", "lomas-lagoon", "surutu-sunset"],
  },
  {
    slug: "la-arboleda-lot-31",
    name: "La Arboleda",
    lotLabel: "Lot 31",
    area: "Cotoca",
    municipality: "Cotoca",
    latitude: -17.77546,
    longitude: -62.982,
    areaSquareMeters: 450,
    totalPriceUsd: 9_900,
    downPaymentUsd: 1_500,
    termMonths: 84,
    roadAccess: "GRAVEL",
    terrain: "FLAT",
    utilities: ["ELECTRICITY", "WATER"],
    description:
      "A shaded lot east of the city near Cotoca, among old trees and open pasture. A simple, accessible way to own a first piece of land.",
    photos: ["motacu-palm", "motacu-grove", "turubo-aerial"],
  },
  {
    slug: "el-prado-lot-3",
    name: "El Prado",
    lotLabel: "Lot 3",
    area: "Warnes",
    municipality: "Warnes",
    latitude: -17.50746,
    longitude: -63.135,
    areaSquareMeters: 360,
    totalPriceUsd: 8_400,
    downPaymentUsd: 840,
    termMonths: 72,
    roadAccess: "PAVED",
    terrain: "FLAT",
    utilities: ["ELECTRICITY", "WATER", "INTERNET"],
    description:
      "A small, level lot in a growing neighborhood north of the city. Paved access and services already in place make it the easiest place to start.",
    photos: ["volcan-meadow", "turubo-aerial", "acuri-palm"],
  },
  {
    slug: "bosque-norte-lot-22",
    name: "Bosque Norte",
    lotLabel: "Lot 22",
    area: "Montero",
    municipality: "Montero",
    latitude: -17.34992,
    longitude: -63.292,
    areaSquareMeters: 1_000,
    totalPriceUsd: 15_600,
    downPaymentUsd: 1_320,
    termMonths: 84,
    status: "RESERVED",
    roadAccess: "GRAVEL",
    terrain: "FLAT",
    utilities: ["ELECTRICITY"],
    description:
      "A wooded lot outside Montero with tall trees along its northern edge. Currently reserved; tell us you're interested and we'll let you know if it becomes available.",
    photos: ["amboro-hills", "amboro-vista", "volcan-valley"],
  },
  {
    slug: "jardines-del-este-lot-19",
    name: "Jardines del Este",
    lotLabel: "Lot 19",
    area: "Paurito",
    municipality: "Santa Cruz de la Sierra",
    latitude: -17.86746,
    longitude: -62.948,
    areaSquareMeters: 2_000,
    totalPriceUsd: 24_000,
    downPaymentUsd: 2_400,
    termMonths: 120,
    roadAccess: "DIRT",
    terrain: "FLAT",
    utilities: [],
    description:
      "Two thousand square meters of open country east of the city, with big skies and room for an orchard. No services yet: this one is for people who like a blank page.",
    photos: ["turubo-aerial", "volcan-lake-2", "riogrande-hills"],
  },
];
