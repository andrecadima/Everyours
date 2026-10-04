/**
 * An approximate lot outline: a square of the lot's area centred on its point.
 * Real surveyed polygons can replace this later without touching the map code.
 */
export function lotOutline(lat: number, lng: number, areaSquareMeters: number): [number, number][] {
  const half = Math.sqrt(areaSquareMeters) / 2;
  const dLat = half / 111_320;
  const dLng = half / (111_320 * Math.cos((lat * Math.PI) / 180));
  return [
    [lng - dLng, lat + dLat],
    [lng + dLng, lat + dLat],
    [lng + dLng, lat - dLat],
    [lng - dLng, lat - dLat],
  ];
}

export function lotFeatureCollection(lat: number, lng: number, areaSquareMeters: number) {
  const corners = lotOutline(lat, lng, areaSquareMeters);
  return {
    outline: {
      type: "Feature" as const,
      properties: {},
      geometry: { type: "Polygon" as const, coordinates: [[...corners, corners[0]]] },
    },
    stakes: {
      type: "FeatureCollection" as const,
      features: corners.map((c) => ({
        type: "Feature" as const,
        properties: {},
        geometry: { type: "Point" as const, coordinates: c },
      })),
    },
  };
}
