import { MIN_CELL_RADIUS } from "../contexts/GridCellSizeContext";
import { getMetersPerPixel } from "./meters-per-pixels.helper";

export function getCellSizeInMetersByZoom({
  zoomLevel,
  lat,
}: {
  zoomLevel: number;
  lat: number;
}): number {
  const minSellRadius = getMetersPerPixel({ zoomLevel, lat }) * MIN_CELL_RADIUS;
  if (Math.floor(zoomLevel) < 12) {
    return 1500 * 2 ** (11 - Math.floor(zoomLevel));
  }
  if (Math.floor(zoomLevel) === 12) {
    return 1000;
  }

  if (zoomLevel >= 13 && zoomLevel <= 13.5) {
    return 500;
  }
  return minSellRadius;
}
