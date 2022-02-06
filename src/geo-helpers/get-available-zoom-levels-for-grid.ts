import { MARKER_RADIUS } from "../contexts/GridCellSizeContext";
import { getMetersPerPixel } from "./get-meters-per-pixel.helper";
import { INITIAL_LATITUDE } from "../contexts/CellSizeContext";

/***
 * @return {number: number} ZoomLevel: marker size in meters
 */
export function resolveMarkerSizesForZoomLevels(): Record<number, number> {
  const steps: Record<number, number> = {};
  const supportedZoomLevels = new Array(18)
    .fill(undefined)
    .map((_, index) => index + 1)
    .slice(1);

  supportedZoomLevels.forEach((zoomLevel) => {
    steps[zoomLevel] =
      getMetersPerPixel({ zoomLevel, lat: INITIAL_LATITUDE }) * MARKER_RADIUS;
  });

  return steps;
}

export function resolveZoomLevelForMakerSize(internalDiameter: number): number {
  const zoomLevelDiametersPairs = Object.entries(
    resolveMarkerSizesForZoomLevels()
  ).map(([zoomLevel, diameter]) => [parseInt(zoomLevel, 10), diameter]);
  const maxZoomLevel =
    zoomLevelDiametersPairs[zoomLevelDiametersPairs.length - 1];
  let i = 0;
  while (i < maxZoomLevel[0]) {
    if (internalDiameter > zoomLevelDiametersPairs[i][1]) {
      break;
    }
    i++;
  }
  console.log(`zoomLevel: ${i}, markerDiameter: ${internalDiameter}`);
  return i;
}

function invert(obj: Record<string | number, string | number>) {
  return Object.entries(obj).reduce((acc, [key, item]) => {
    acc[item] = key;
    return acc;
  }, {} as Record<string | number, string | number>);
}
