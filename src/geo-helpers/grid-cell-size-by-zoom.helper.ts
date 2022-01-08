export function getCellSizeInMetersByZoom(zoomLevel: number): number {
  switch (Math.floor(zoomLevel)) {
    // case 10:
    //   return 8000;
    // case 11:
    //   return 4000;
    // case 12:
    //   return 2000;
    // case 13:
    //   return 1000;
    // case 14:
    //   return 500;
    default:
      return 2000;
  }
}
