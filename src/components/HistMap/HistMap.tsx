import React from "react";
import { ArtilleryHit, asArray } from "../../model";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

type HistMapProps = {
  hits: ArtilleryHit[];
  className?: string;
};

/**
 * Leaflet map that will display artillery hits and modern Saint-Petersburg map.
 */
export default function HistMap(props: HistMapProps): JSX.Element {
  const { hits, className } = props;
  return (
    <MapContainer
      center={[59.9227, 30.3353]}
      zoom={10}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {hits.map((hit, index) => (
          <Marker position={asArray(hit.position)} key={index}>
            <Popup>
              {hit.date.toString()} <br /> {hit.address}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
