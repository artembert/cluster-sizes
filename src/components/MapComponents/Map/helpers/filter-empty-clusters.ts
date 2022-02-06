import { ClusterFeature } from "../models/cluset-feature.interface";

export function filterClusterPoints(
  points: ClusterFeature[]
): ClusterFeature[] {
  return points.filter((item) => {
    if (item.geometry.type !== "Point") {
      return false;
    }
    if (!item.properties.id || !item.properties.num) {
      return false;
    }
    return true;
  });
}
