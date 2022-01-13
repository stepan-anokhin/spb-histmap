import React from "react";
import { ArtilleryHit, asArray } from "../../model";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
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
  geojsons: GeoJSON.GeoJsonObject[];
  className?: string;
};

function addFrontLineTooltip(feature: any, layer: L.Layer) {
  const { description = "", dateStart, dateEnd } = feature.properties;
  layer.bindTooltip(
    description +
      "<br/><br/>Линия фронта действовала с:<br/>" +
      (dateStart == undefined
        ? "<неизвестно>"
        : new Date(dateStart).toString()) +
      "</br>по:<br/>" +
      (dateEnd == undefined ? "<неизвестно>" : new Date(dateEnd).toString()),
    { sticky: true }
  );
}

function setFrontLineStyle(feature: any) {
  const FRONT_LINE_COLOR = "red";
  const { color = FRONT_LINE_COLOR } = feature.properties;
  return { color: color };
}

function renderGeoJSONs(jsons: GeoJSON.GeoJsonObject[]): React.ReactNode[] {
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
