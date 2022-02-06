import { getMetersPerPixel } from "./get-meters-per-pixel.helper";

type Pixels = number;

export function getPixelsFromMeters({
  lat,
  meters,
  zoomLevel,
}: {
  lat: number;
  meters: number;
  zoomLevel: number;
}): Pixels {
  return meters / getMetersPerPixel({ lat, zoomLevel });
}
