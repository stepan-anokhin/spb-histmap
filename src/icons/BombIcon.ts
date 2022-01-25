import L from "leaflet";
import BombIconSVG from "../../assets/icons/bomb.svg";

const BombIcon = new L.Icon({
  iconUrl: BombIconSVG,
  iconRetinaUrl: BombIconSVG,
  iconSize: [35, 35],
});

export default BombIcon;
