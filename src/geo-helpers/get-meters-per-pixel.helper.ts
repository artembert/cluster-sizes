import { EARTH_CIRCUMFERENCE } from "./constants/earth-circumreference.constant";

type Meters = number;

export function getMetersPerPixel({
  zoomLevel,
  lat,
  px = 1,
}: {
  lat: number;
  zoomLevel: number;
  px?: number;
}): Meters {
  const latitudeRadians = lat * (Math.PI / 180);
  const meters =
    (EARTH_CIRCUMFERENCE * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8);
  return meters * px;
}
