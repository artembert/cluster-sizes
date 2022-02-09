import {
  ClusterSizesZoomLevelsDictionary,
  LayerZoomRestrictions,
} from "./get-zoom-levels-for-layers.helper";
import {
  getClusterSourceByClusterDiameter,
  ClustersSourceMetadata,
} from "../data/sources";

export function getVisibleLayerForGivenZoomLevel(
  clusterSizesZoomLevelsDictionary: ClusterSizesZoomLevelsDictionary,
  clusterLayers: ClustersSourceMetadata[],
  zoomLevel: number
): ClustersSourceMetadata | null {
  let desiredClusterSize: string = "";
  const arr = Object.entries(clusterSizesZoomLevelsDictionary);
  for (let i = 0; i < arr.length; i++) {
    const [clusterSizeString, { minZoom, maxZoom }]: [
      string,
      LayerZoomRestrictions
    ] = arr[i];
    // console.log(arr[i]);
    if (zoomLevel > minZoom && zoomLevel < maxZoom) {
      desiredClusterSize = clusterSizeString;
      break;
    }
  }
  if (desiredClusterSize) {
    return getClusterSourceByClusterDiameter(desiredClusterSize);
  }
  return null;
}