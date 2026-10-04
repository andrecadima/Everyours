import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description =
  "Discover land in Santa Cruz, Bolivia with accessible monthly payment options. Find your place and make it yours with Everyours.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Everyours — Land ownership within reach",
    template: "%s · Everyours",
  },
  description,
  applicationName: "Everyours",
  openGraph: {
    type: "website",
    siteName: "Everyours",
    title: "Everyours — Land ownership within reach",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everyours — Land ownership within reach",
    description,
  },
};
