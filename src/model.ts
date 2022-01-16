import * as geojson from "geojson";
import RequireContext = __WebpackModuleApi.RequireContext;

export type Address = {
  street: string;
  houseNumber: number;
};

export type Position = {
  lat: number;
  lng: number;
};

export type House = {
  address: Address;
  position: Position;
};

export type ArtilleryHit = {
  date: Date;
  address: Address;
  position: Position;
};

/**
 * Front-line GeoJSON properties.
 */
export type FrontLineProps = {
  description: string;
  dateStart: string;
  dateEnd: string;
  color: string;
};

/**
 * Expected data scheme for front-line .geojson files.
 */
export type FrontLineGeoJSON = geojson.FeatureCollection<
  geojson.Geometry,
  FrontLineProps
>;

/**
 * Expected data scheme for a single front-line element.
 */
export type FrontLineElement = geojson.Feature<
  geojson.Geometry,
  FrontLineProps
>;

export function getGeoJSONs(
  requireContext: RequireContext
): FrontLineGeoJSON[] {
  return requireContext.keys().map((key) => {
    return requireContext(key) as FrontLineGeoJSON;
  });
}

export function asArray(position: Position): [number, number] {
  return [position.lat, position.lng];
}
