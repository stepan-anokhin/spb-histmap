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

export function asArray(position: Position): [number, number] {
  return [position.lat, position.lng];
}
