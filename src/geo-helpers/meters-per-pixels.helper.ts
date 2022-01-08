export function getMetersPerPixel({
  zoomLevel,
  lat,
}: {
  lat: number;
  zoomLevel: number;
}) {
  const EARTH_CIRCUMREFERENCE = 40075017;
  const latitudeRadians = lat * (Math.PI / 180);
  return (
    (EARTH_CIRCUMREFERENCE * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
}

export function getPixelsFromMeters({
  lat,
  meters,
  zoomLevel,
}: {
  lat: number;
  meters: number;
  zoomLevel: number;
}) {
  return meters / getMetersPerPixel({ lat, zoomLevel });
}
