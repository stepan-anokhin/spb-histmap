import { XMLParser } from "fast-xml-parser";
import { promises as fs } from "fs";
import { Address, House, Position } from "../model";

/**
 * Root 'osm' tag of the OpenStreetMap data file.
 *
 * See: https://wiki.openstreetmap.org/wiki/OSM_XML
 * See: https://wiki.openstreetmap.org/wiki/Elements
 */
export type OSMData = {
  version: string;
  generator: string;
  timestamp: string;
  bounds: OSMBounds;
  node: OSMNode[];
  way: OSMWay[];
};

/**
 * OSM Root's <bounds/> tag, representing area covered by the given .osm-file.
 * See: https://wiki.openstreetmap.org/wiki/OSM_XML#Example_OSM_XML_file
 */
export type OSMBounds = {
  minlat: string;
  minlon: string;
  maxlat: string;
  maxlon: string;
};

/**
 * OpenStreetMap Node element.
 * See: https://wiki.openstreetmap.org/wiki/Elements#Node
 */
export type OSMNode = {
  id: string;
  lat: string;
  lon: string;
  version: string;
  tag?: OSMTag | OSMTag[];
};

/**
 * OpenStreetMap Tag element.
 * See: https://wiki.openstreetmap.org/wiki/Elements#Tag
 */
export type OSMTag = {
  k: string;
  v: string;
};

/**
 * OSM <nd ref=".."/> tag (node reference inside way).
 * See: https://wiki.openstreetmap.org/wiki/OSM_XML#Example_OSM_XML_file
 */
export type OSMNodeRef = {
  ref: string;
};

/**
 * OpenStreetMap Way element.
 * See: https://wiki.openstreetmap.org/wiki/Elements#Way
 */
export type OSMWay = {
  id: string;
  version: string;
  tag?: OSMTag | OSMTag[];
  nd: OSMNodeRef[];
};

/**
 * Parse *.osm file.
 */
export async function parseOSMFile(path: string): Promise<OSMData> {
  const osmText = await fs.readFile(path);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  return parser.parse(osmText).osm as OSMData;
}

/**
 * Known OSM tag keys.
 */
export enum OSMKey {
  ADDR_CITY = "addr:city",
  ADDR_HOUSE_NUMBER = "addr:housenumber",
  ADDR_POSTCODE = "addr:postcode",
  ADDR_STREET = "addr:street",
}

/**
 * Tagged OpenStreetMap data element.
 */
export type OSMTagged = {
  tag?: OSMTag | OSMTag[];
};

/**
 * Convenience wrapper around tagged OSM element.
 */
class Tagged<TTagged extends OSMTagged = OSMTagged> {
  readonly data: TTagged;
  constructor(data: TTagged) {
    this.data = data;
  }

  get city(): string | undefined {
    return this.getTag(OSMKey.ADDR_CITY);
  }

  get houseNumber(): number | undefined {
    const houseNumber = this.getTag(OSMKey.ADDR_HOUSE_NUMBER);
    return houseNumber != null ? Number(houseNumber) : undefined;
  }

  get street(): string | undefined {
    return this.getTag(OSMKey.ADDR_STREET);
  }

  get address(): Address | undefined {
    const street = this.street;
    const houseNumber = this.houseNumber;
    if (street != null && houseNumber != null) {
      return { street: street, houseNumber: houseNumber };
    }
  }

  getTag(key: string): string | undefined {
    return this.tags.find((tag) => tag.k === key)?.v;
  }

  get tags(): OSMTag[] {
    const tagAttr = this.data.tag;
    if (Array.isArray(tagAttr)) {
      return tagAttr;
    } else if (tagAttr == null) {
      return [];
    } else {
      return [tagAttr];
    }
  }
}

/**
 * Convenience wrapper around OSM Node element.
 */
class Node extends Tagged<OSMNode> {
  constructor(data: OSMNode) {
    super(data);
  }

  get position(): Position {
    return { lat: Number(this.data.lat), lng: Number(this.data.lon) };
  }
}

/**
 * Address index holds unique data for each [street, houseNumber] pair.
 */
class AddressIndex<TData = unknown> {
  private readonly index: Map<string, Map<number, TData>>;
  constructor() {
    this.index = new Map<string, Map<number, TData>>();
  }

  set(address: Address, value: TData) {
    let houseIndex = this.index.get(address.street);
    if (houseIndex == null) {
      houseIndex = new Map<number, TData>();
      this.index.set(address.street, houseIndex);
    }
    houseIndex.set(address.houseNumber, value);
  }

  entries(): [Address, TData][] {
    const result: [Address, TData][] = [];
    for (const [street, houses] of this.index.entries()) {
      for (const [houseNumber, data] of houses.entries()) {
        result.push([{ street, houseNumber }, data]);
      }
    }
    return result;
  }
}

function* nodes(osmData: OSMData): Iterable<Node> {
  for (const osmNode of osmData.node) {
    yield new Node(osmNode);
  }
}

/**
 * Extract all unique houses from the given OSM Data.
 */
export function extractHouses(osmData: OSMData): House[] {
  const addrIndex = new AddressIndex<Position>();
  for (const node of nodes(osmData)) {
    const address = node.address;
    if (address != null) {
      addrIndex.set(address, node.position);
    }
  }
  const result: House[] = [];
  for (const [address, position] of addrIndex.entries()) {
    result.push({ address, position });
  }
  return result;
}
