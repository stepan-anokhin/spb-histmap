import React from "react";
import { ArtilleryHit, asArray } from "../../model";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { LatLngBounds } from "leaflet";
import { format as formatDate } from "date-fns";

/**
 * Area displayed by HistMap.
 */
const mapBounds = new LatLngBounds(
  { lat: 59.4562, lng: 28.515 },
  { lat: 60.4667, lng: 32.2229 }
);

type HistMapProps = {
  hits: ArtilleryHit[];
  className?: string;
};

/**
 * Leaflet map that will display artillery hits and modern Saint-Petersburg map.
 */
const HistMap = React.memo(function HistMap(props: HistMapProps): JSX.Element {
  const { hits, className } = props;
  return (
    <MapContainer
      center={[59.9227, 30.3353]}
      zoom={9}
      scrollWheelZoom
      zoomControl={false}
      className={className}
      maxBounds={mapBounds}
      minZoom={9}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {hits.map((hit, index) => (
          <Marker position={asArray(hit.position)} key={index}>
            <Popup>
              Дата: {formatDate(hit.date, "dd.MM.yyyy")} <br /> Адрес:{" "}
              {hit.address.street}, {hit.address.houseNumber}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default HistMap;
