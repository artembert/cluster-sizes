import { ClusterDataField } from "../../../../models/cluster-data-field.type";

export interface ClusterProperties extends Record<ClusterDataField, string> {
  id: number;
  num: string;
}

export interface ClusterFeature {
  geometry: { type: "Point"; coordinates: [number, number] };
  source: string;
  sourceLayer: string;
  properties: ClusterProperties;
}
