import React from "react";
import {
  ArtilleryHit,
  asArray,
  FrontLineElement,
  FrontLineGeoJSON,
} from "../../model";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L, { LatLngBounds, PathOptions } from "leaflet";
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
  geojsons: FrontLineGeoJSON[];
  className?: string;
};

function addFrontLineTooltip(feature: FrontLineElement, layer: L.Layer) {
  const { description = "", dateStart, dateEnd } = feature.properties;
  layer.bindTooltip(
    description +
      "<br/><br/>На период с:<br/>" +
      (dateStart == undefined
        ? "<неизвестно>"
        : new Date(dateStart).toString()) +
      "</br>по:<br/>" +
      (dateEnd == undefined ? "<неизвестно>" : new Date(dateEnd).toString()),
    { sticky: true }
  );
}

function setFrontLineStyle(feature?: FrontLineElement): PathOptions {
  if (feature == null) {
    return {};
  }
  const { color = "red" } = feature.properties;
  return { color: color };
}

function renderGeoJSONs(jsons: FrontLineGeoJSON[]): React.ReactNode[] {
  return jsons.map((json, index) => (
    <GeoJSON
      data={json}
      key={index}
      style={setFrontLineStyle}
      onEachFeature={addFrontLineTooltip}
    />
  ));
}

/**
 * Leaflet map that will display artillery hits and modern Saint-Petersburg map.
 */
const HistMap = React.memo(function HistMap(props: HistMapProps): JSX.Element {
  const { hits, geojsons, className } = props;
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
      {renderGeoJSONs(geojsons)}
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
