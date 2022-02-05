import { getZoomLevelByMetersAndPixels } from "./get-zoom-level-by-meters-and-pixels.helper";
import {
  INITIAL_LATITUDE,
  MAX_ZOOM_LEVEL,
  MAX_MARKER_DIAMETER,
} from "../contexts/CellSizeContext";

export interface LayerZoomRestrictions {
  minZoom: number;
  maxZoom: number;
}

export function getZoomLevelsForLayers(
  clusterInternalDiameters: number[]
): Record<number, LayerZoomRestrictions> {
  const collection: Map<number, LayerZoomRestrictions> = new Map<
    number,
    LayerZoomRestrictions
  >();

  clusterInternalDiameters.reverse().forEach((diameter, index, arr) => {
    collection.set(diameter, {
      minZoom: getZoomLevelByMetersAndPixels({
        meters: diameter,
        px: MAX_MARKER_DIAMETER,
        lat: INITIAL_LATITUDE,
      }),
      maxZoom: MAX_ZOOM_LEVEL,
      // minZoom: 0,
      // maxZoom: getZoomLevelByMetersAndPixels({
      //   meters: diameter,
      //   px: MIN_MARKER_DIAMETER,
      //   lat: INITIAL_LATITUDE,
      // }),
    });
  });

  Array.from(collection).forEach(
    ([diameter, { minZoom, maxZoom }], index, array) => {
      if (index < array.length - 1) {
        // if (index > 0) {
        collection.set(diameter, {
          minZoom,
          maxZoom: array[index + 1][1].minZoom,
        });
      }
    }
  );

  return Object.fromEntries(collection);
}
