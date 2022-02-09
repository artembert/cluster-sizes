import { LayerZoomRestrictions } from "../geo-helpers/get-zoom-levels-for-layers.helper";
import { MAX_CLUSTER_ZOOM_LEVEL } from "../contexts/CellSizeContext";

export interface SourceMetadata {
  id: string;
  table: string;
}

export interface ClustersSourceMetadata extends SourceMetadata {
  internalDiameter: number;
}

/***
 * Get layersNames from http://139.geosemantica.ru:15121/index.json:
 *
 * Object.keys(temp1)
 *   .map((name) => name.slice(17))
 *   .sort((a, b) => (parseFloat(a) > parseFloat(b) ? 1 : -1))
 *   .map((name) => name.slice(0, name.length - 2));
 */

const cellInternalDiameterSizes: string[] = [
  "500",
  "1000",
  "1500",
  "2000",
  "2500",
  "3000",
  "3500",
  "4000",
  "4500",
  // "5000",
  // "5500",
  // "6000",
  // "6500",
  // "7000",
  // "7500",
  // "8000",
  "8500",
  // "9000",
  // "9500",
  // "10000",
  // "11000",
  // "12000",
  "13000",
  // "14000",
  // "15000",
  // "16000",
  // "17000",
  // "18000",
  "19000",
  // "20000",
  // "21000",
  // "22000",
  // "23000",
  // "24000",
  // "25000",
  // "26000",
  "27000",
  // "28000",
  // "29000",
  // "30000",
  // "31000",
  "32000",
];

export const hexagonSources: ClustersSourceMetadata[] =
  cellInternalDiameterSizes.map((size) =>
    getHexagonSourceByClusterDiameter(size)
  );

export const clusterSources: ClustersSourceMetadata[] =
  cellInternalDiameterSizes.map((size) =>
    getClusterSourceByClusterDiameter(size)
  );

function getHexagonSourceByClusterDiameter(
  clusterDiameter: string
): ClustersSourceMetadata {
  return {
    id: "public.stat_grid_" + clusterDiameter + "_0",
    table: "stat_grid_" + clusterDiameter + "_0",
    internalDiameter: parseInt(clusterDiameter, 10),
  };
}

export function getClusterSourceByClusterDiameter(
  clusterDiameter: string
): ClustersSourceMetadata {
  return {
    id: "public.stat_grid_" + clusterDiameter + "_0_centroid",
    table: "stat_grid_" + clusterDiameter + "_0_centroid",
    internalDiameter: parseInt(clusterDiameter, 10),
  };
}

export const pointsSource: SourceMetadata & LayerZoomRestrictions = {
  id: "public.izi_waste_random",
  table: "izi_waste_random",
  minZoom: MAX_CLUSTER_ZOOM_LEVEL,
  maxZoom: 22,
};
