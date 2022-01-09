import React from "react";
import ReactDOM from "react-dom";
import Application from "./components/Application";
import hits from "./data";
import { getGeoJSONs } from "./model";

let geojsons : GeoJSON.GeoJsonObject[] = getGeoJSONs(require.context("../frontlines", false, /.geojson$/));

ReactDOM.render(<Application hits={hits} geojsons={geojsons}/>, document.querySelector("#root"));
