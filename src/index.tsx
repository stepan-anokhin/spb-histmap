import React from "react";
import ReactDOM from "react-dom";
import Application from "./components/Application";
import hits from "./data";

ReactDOM.render(<Application hits={hits} />, document.querySelector("#root"));
