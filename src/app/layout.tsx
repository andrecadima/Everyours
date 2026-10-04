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

export const viewport: Viewport = {
  themeColor: "#f3f2ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-sm bg-monte px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
