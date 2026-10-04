import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import credits from "../../../prisma/data/image-credits.json";

export const metadata: Metadata = { title: "Photo credits" };

export default function CreditsPage() {
  return (
    <LegalPage title="Photo credits">
      <p>
        Photos on this preview illustrate the landscapes of Santa Cruz and the neighboring lowlands (a few were taken across
        the border in Brazil). They are not photos of the listed lots. They are used under Creative Commons licenses from
        Wikimedia Commons. Thank you to these photographers.
      </p>
      <ul>
        {Object.entries(credits).map(([slug, c]) => (
          <li key={slug}>
            <a href={c.source} target="_blank" rel="noopener noreferrer">
              {c.title.replace(/\.(jpe?g|png|tif)$/i, "")}
            </a>{" "}
            by {c.artist},{" "}
            <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
              {c.license}
            </a>
            . Resized and compressed.
          </li>
        ))}
      </ul>
      <p>Map data &copy; OpenStreetMap contributors, tiles by OpenFreeMap and OpenMapTiles, terrain by Mapzen.</p>
    </LegalPage>
  );
}
