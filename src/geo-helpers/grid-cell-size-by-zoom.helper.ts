import { DefinedZoomLevel, MetersCellSizes } from "../contexts/CellSizeContext";

export function getCellSizeInMetersByZoom({
  zoomLevel,
  cellSizes,
}: {
  zoomLevel: number;
  cellSizes: MetersCellSizes;
}): number {
  const list = Object.entries<number>(cellSizes) as [
    DefinedZoomLevel,
    number
  ][];
  for (let [savedZoomLevel] of list) {
    if (zoomLevel < Number(savedZoomLevel)) {
      return cellSizes[savedZoomLevel] as number;
    }
  }
  return list[list.length - 1][1];
}
