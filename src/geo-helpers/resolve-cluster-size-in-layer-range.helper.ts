import {
  MAX_MARKER_DIAMETER,
  MIN_MARKER_DIAMETER,
} from "../contexts/CellSizeContext";

export function resolveClusterSizeInLayerRange(
  current: number,
  min: number,
  max: number
): number {
  const difference = (current - min) / (max - min);
  return (
    MIN_MARKER_DIAMETER +
    (MAX_MARKER_DIAMETER - MIN_MARKER_DIAMETER) * difference
  );
}
