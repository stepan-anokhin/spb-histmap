import * as geojson from "geojson";
import { parse as parseDate } from "date-fns";
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

export enum AddressType {
  MODERN = "modern",
  HISTORIC = "historic",
}

/**
 * Hits filters.
 */
export type HitFilters = {
  street: string;
  houseNumber?: number | null;
  addrType: AddressType;
  minDate?: Date | null;
  maxDate?: Date | null;
};

/**
 * Frontline filters.
 */
export type FrontLineFilters = {
  show: boolean;
  date?: Date | null;
};

/**
 * App options.
 */
export type AppOptions = {
  hit: HitFilters;
  frontLine: FrontLineFilters;
};

export const DefaultAppOptions: AppOptions = {
  hit: {
    addrType: AddressType.MODERN,
    street: "",
    houseNumber: null,
    minDate: null,
    maxDate: null,
  },
  frontLine: {
    show: true,
    date: null,
  },
};

export const FrontLineDateFormat = "yyyy-MM-dd";

/**
 * Parse front-line date.
 */
export function parseFrontLineDate(date: string): Date {
  return parseDate(date, FrontLineDateFormat, new Date());
}

/**
 * Check if artillery hit satisfies filters.
 */
export function checkHit(hit: ArtilleryHit, filters: HitFilters): boolean {
  if (filters.street && !hit.address.street.includes(filters.street)) {
    return false;
  }
  if (
    filters.houseNumber != null &&
    hit.address.houseNumber !== filters.houseNumber
  ) {
    return false;
  }
  if (filters.minDate != null && hit.date < filters.minDate) {
    return false;
  }
  if (filters.maxDate != null && hit.date > filters.maxDate) {
    return false;
  }
  return true;
}

export function checkFrontLine(
  frontLine: FrontLineGeoJSON,
  filters: FrontLineFilters
): boolean {
  if (!filters.show) {
    return false;
  }
  if (filters.date != null) {
    const date = filters.date;
    return frontLine.features.every(
      (feature) =>
        parseFrontLineDate(feature.properties.dateStart) <= date &&
        parseFrontLineDate(feature.properties.dateEnd) >= date
    );
  }
  return true;
}
