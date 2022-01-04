import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import HistMapApplication from "./components/HistMapApplication";

import hits from "./data";

ReactDOM.render(
  <HistMapApplication hits={hits} />,
  document.querySelector("#root")
);
