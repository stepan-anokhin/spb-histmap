import { ArtilleryHit, HitType } from "../../model";
import { Icon } from "leaflet";
import ArtilleryIcon from "../../icons/ArtilleryIcon";
import BombIcon from "../../icons/BombIcon";
import FireIcon from "../../icons/FireIcon";

export default function hitIcon(hit: ArtilleryHit): Icon {
  switch (hit.type) {
    case HitType.Artillery:
      return ArtilleryIcon;
    case HitType.Fougasse:
      return BombIcon;
    case HitType.Incendiary:
      return FireIcon;
  }
}
