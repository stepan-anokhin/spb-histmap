import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import HistMapApplication from "./components/HistMapApplication";
import { FrontLineGeoJSON, getGeoJSONs } from "./model";
import hits from "./data";

const geojsons: FrontLineGeoJSON[] = getGeoJSONs(
  require.context("../frontlines", false, /.geojson$/)
);

ReactDOM.render(
  <HistMapApplication hits={hits} geojsons={geojsons} />,
  document.querySelector("#root")
);
