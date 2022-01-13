import React, { useCallback, useState } from "react";
import { ArtilleryHit } from "../../model";
import HistMap from "../HistMap";
import { Theme, useMediaQuery } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Fab from "@mui/material/Fab";
import { darkTheme } from "../../theme";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import Sidebar from "../Sidebar";

const AppContainer = styled("div")({
  width: "100vw",
  height: "100vh",
});

const StyledHistMap = styled(HistMap)({
  height: "100%",
});

const SidebarFab = styled(Fab)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: theme.zIndex.appBar,
}));

/**
 * Drawer properties.
 */
type UseDrawerResults = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  variant: "temporary" | "persistent";
};

/**
 * State related to controlling sidebar Drawer.
 */
function useDrawer(theme: Theme): UseDrawerResults {
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!smallScreen);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  return {
    open,
    handleOpen,
    handleClose,
    variant: smallScreen ? "temporary" : "persistent",
  };
}

type ApplicationProps = {
  hits: ArtilleryHit[];
  geojsons : GeoJSON.GeoJsonObject[]
  theme?: Theme;
  className?: string;
};

function HistMapApplication(props: ApplicationProps): JSX.Element {
  const { hits, geojsons, theme = darkTheme, className } = props;
  const drawer = useDrawer(theme);

  return (
    <AppContainer className={className}>
      <ThemeProvider theme={theme}>
        <StyledHistMap hits={hits} geojsons={geojsons} />
        <Tooltip title="Настройки поиска">
          <SidebarFab onClick={drawer.handleOpen}>
            <MenuIcon />
          </SidebarFab>
        </Tooltip>
        <Drawer
          anchor="left"
          open={drawer.open}
          onClose={drawer.handleClose}
          variant={drawer.variant}
        >
          <Sidebar
            onBack={() => {
              console.log("Clicked!");
              drawer.handleClose();
            }}
          />
        </Drawer>
      </ThemeProvider>
    </AppContainer>
  );
}

export default HistMapApplication;
