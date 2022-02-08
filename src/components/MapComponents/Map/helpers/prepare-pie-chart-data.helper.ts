import { PieChartItem } from "../../CanvasPoint/CanvasPoint";
import { ClusterProperties } from "../models/cluset-feature.interface";
import { pieChartColors } from "../../../../data/pie-chart-colors.constant";
import { ClusterDataField } from "../../../../models/cluster-data-field.type";

export function preparePieChartData(
  clusterProperties: ClusterProperties
): PieChartItem[] {
  const pairs: PieChartItem[] = [];
  Object.entries(clusterProperties).forEach(([key, value]) => {
    const color = pieChartColors[key as ClusterDataField];
    if (color) {
      const pair: PieChartItem = {
        value: parseInt(value, 10) > 0 ? 1 : 0,
        label: key,
        color,
      };
      pairs.push(pair);
    }
  });
  return pairs;
}
