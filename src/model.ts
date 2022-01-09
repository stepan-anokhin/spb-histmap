export type Position = {
  lat: number;
  lng: number;
};

export type ArtilleryHit = {
  date: Date;
  address: string;
  position: Position;
};

export function getGeoJSONs(
  requireContext : __WebpackModuleApi.RequireContext) : GeoJSON.GeoJsonObject[] {
  return requireContext.keys().map((key) => {
    return requireContext(key) as GeoJSON.GeoJsonObject;
  });
}

export function asArray(position: Position): [number, number] {
  return [position.lat, position.lng];
}
