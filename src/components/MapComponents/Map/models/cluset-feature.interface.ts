export interface ClusterFeature {
  geometry: { type: "Point"; coordinates: [number, number] };
  source: string;
  sourceLayer: string;
  properties: { id: number; num: string };
}
