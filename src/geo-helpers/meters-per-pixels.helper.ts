export function getMetersPerPixel({
  zoomLevel,
  latitude,
}: {
  latitude: number;
  zoomLevel: number;
}) {
  const EARTH_CIRCUMREFERENCE = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (EARTH_CIRCUMREFERENCE * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
}

export function getPixelsFromMeters({
  latitude,
  meters,
  zoomLevel,
}: {
  latitude: number;
  meters: number;
  zoomLevel: number;
}) {
  return meters / getMetersPerPixel({ latitude, zoomLevel });
}
