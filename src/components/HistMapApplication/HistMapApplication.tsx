import React from "react";
import { ArtilleryHit } from "../../model";
import HistMap from "../HistMap";
import { Theme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../theme";
import { styled } from "@mui/system";

const AppContainer = styled("div")({
  width: "100vw",
  height: "100vh",
});

const StyledHistMap = styled(HistMap)({
  height: "100%",
});

type ApplicationProps = {
  hits: ArtilleryHit[];
  theme?: Theme;
  className?: string;
};

function HistMapApplication(props: ApplicationProps): JSX.Element {
  const { hits, theme = darkTheme, className } = props;
  return (
    <AppContainer className={className}>
      <ThemeProvider theme={theme}>
        <StyledHistMap hits={hits} />
      </ThemeProvider>
    </AppContainer>
  );
}

export default HistMapApplication;
