import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Everyours: land ownership within reach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "src/app/fonts/archivo-400.ttf")),
    readFile(join(process.cwd(), "src/app/fonts/archivo-600.ttf")),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#1f4a37",
          color: "#f3f2ec",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="44" height="44" viewBox="0 0 24 24">
            <rect x="5" y="2.5" width="2.2" height="19" rx="1" fill="#f3f2ec" />
            <path d="M8 3.5h10.2a.8.8 0 0 1 .62 1.3L16.4 8l2.42 3.2a.8.8 0 0 1-.62 1.3H8z" fill="#c22f6c" />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>everyours</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>A piece of paradise.</span>
          <span style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05 }}>Forever yours.</span>
          <span style={{ marginTop: 28, fontSize: 32, color: "#e9efe7" }}>
            Land in Santa Cruz, Bolivia, with monthly payment plans.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Archivo", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
