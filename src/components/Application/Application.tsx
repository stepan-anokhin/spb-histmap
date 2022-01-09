import React from "react";
import { ArtilleryHit, asArray } from "../../model";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";

type ApplicationProps = {
  hits: ArtilleryHit[];
  geojsons : GeoJSON.GeoJsonObject[];

  className?: string;
};

function addFrontLineTooltip(feature : any, layer : L.Layer) {
  const { description = "", dateStart, dateEnd } = feature.properties;
  layer.bindTooltip(
    description +
    "<br/><br/>Линия фронта действовала с:<br/>" +
    (dateStart == undefined ? "<неизвестно>" : new Date(dateStart).toString()) +
    "</br>по:<br/>" +
    (dateEnd == undefined ? "<неизвестно>" : new Date(dateEnd).toString()),
    { sticky : true });
}

function setFrontLineStyle(feature : any) {
  const FRONT_LINE_COLOR : string = "red";
  let { color = FRONT_LINE_COLOR } = feature.properties;
  return { color : color };
}

function renderGeoJSONs(jsons : GeoJSON.GeoJsonObject[]) : React.ReactNode[] {
  return jsons.map((json) =>
    <GeoJSON data={json}
    style={setFrontLineStyle}
    onEachFeature={addFrontLineTooltip}/>
  );
}

function Application(props: ApplicationProps): JSX.Element {
  const { hits, geojsons, className } = props;
  return (
    <div className={className} style={{ width: "100vw", height: "100vh" }}>
      <MapContainer
        center={[59.9227, 30.3353]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%" }}
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
                {hit.date.toString()} <br /> {hit.address}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default Application;
