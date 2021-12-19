import React from "react";
import { ArtilleryHit, asArray } from "../../model";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

type ApplicationProps = {
  hits: ArtilleryHit[];
  className?: string;
};

function Application(props: ApplicationProps): JSX.Element {
  const { hits, className } = props;
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
