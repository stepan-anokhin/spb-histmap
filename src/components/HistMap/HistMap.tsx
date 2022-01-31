import React from "react";
import {
  ArtilleryHit,
  asArray,
  FrontLineElement,
  FrontLineGeoJSON,
  parseFrontLineDate,
  DateDisplayFormat,
  hitTypeText,
} from "../../model";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L, { LatLngBounds, PathOptions } from "leaflet";
import { format as formatDate } from "date-fns";
import BombIcon from "../../icons/BombIcon";
import hitIcon from "./hitIcon";

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

function addFrontLinePopup(feature: FrontLineElement, layer: L.Layer) {
  const {
    description = "",
    actionHeader = "Линия фронта действовала",
    dateStart,
    dateEnd,
  } = feature.properties;
  layer.bindPopup(
    description +
      "<br/><br/>" +
      actionHeader +
      " с:<br/>" +
      (dateStart == undefined
        ? "<неизвестно>"
        : formatDate(parseFrontLineDate(dateStart), DateDisplayFormat)) +
      "</br>по:<br/>" +
      (dateEnd == undefined
        ? "<неизвестно>"
        : formatDate(parseFrontLineDate(dateEnd), DateDisplayFormat))
  );
}

function setFrontLineStyle(feature?: FrontLineElement): PathOptions {
  if (feature == null) {
    return {};
  }
  return feature.properties as PathOptions;
}

function renderGeoJSONs(jsons: FrontLineGeoJSON[]): React.ReactNode[] {
  return jsons.map((json, index) => (
    <GeoJSON
      data={json}
      key={index}
      style={setFrontLineStyle}
      onEachFeature={addFrontLinePopup}
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
          <Marker
            position={asArray(hit.position)}
            key={index}
            icon={hitIcon(hit)}
          >
            <Popup>
              Дата: {formatDate(hit.date, DateDisplayFormat)} <br /> Адрес:{" "}
              {hit.address.street}, {hit.address.houseNumber} <br />
              Тип: {hitTypeText(hit.type)} <br />
              {hit.description && `Описание: ${hit.description}`}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default HistMap;
