import React from "react";
import { ArtilleryHit } from "../../model";
import HistMap from "../HistMap";
import { Theme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../theme";

type ApplicationProps = {
  hits: ArtilleryHit[];
  theme?: Theme;
  className?: string;
};

function HistMapApplication(props: ApplicationProps): JSX.Element {
  const { hits, theme = darkTheme, className } = props;
  return (
    <div className={className} style={{ width: "100vw", height: "100vh" }}>
      <ThemeProvider theme={theme}>
        <HistMap hits={hits} />
      </ThemeProvider>
    </div>
  );
}

export default HistMapApplication;
