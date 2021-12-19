export type Position = {
  lat: number;
  lng: number;
};

export type ArtilleryHit = {
  date: Date;
  address: string;
  position: Position;
};

export function asArray(position: Position): [number, number] {
  return [position.lat, position.lng];
}
