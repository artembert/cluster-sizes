import { EARTH_CIRCUMFERENCE } from "./constants/earth-circumreference.constant";

type ZoomLevel = number;

export function getZoomLevelByMetersAndPixels({
  meters,
  px,
  lat,
}: {
  meters: number;
  px: number;
  lat: number;
}): ZoomLevel {
  const latitudeRadians = lat * (Math.PI / 180);
  // 0
  // meters =
  //   (EARTH_CIRCUMFERENCE * Math.cos(latitudeRadians)) /
  //   Math.pow(2, zoomLevel + 8);
  // 1
  // meters=
  //   (EARTH_CIRCUMFERENCE * Math.cos(latitudeRadians)) /
  //   Math.pow(2, zoomLevel + 8);
  // 2
  // Math.pow(2, zoomLevel + 8) =
  //   (EARTH_CIRCUMFERENCE * Math.cos(latitudeRadians)) / meters;
  // 3
  return (
    -8 +
    Math.log2(((EARTH_CIRCUMFERENCE * Math.cos(latitudeRadians)) / meters) * px)
  );
}
