import L from "leaflet";
import ArtilleryIconSVG from "../../assets/icons/artillery.svg";

const ArtilleryIcon = new L.Icon({
  iconUrl: ArtilleryIconSVG,
  iconRetinaUrl: ArtilleryIconSVG,
  iconSize: [35, 35],
});

export default ArtilleryIcon;
