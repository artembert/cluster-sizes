import { FunctionComponent } from "react";
import {
  MIN_CELL_RADIUS,
  useGridSellSize,
} from "../../../contexts/GridCellSizeContext";
import Canvas from "../Canvas/Canvas";
import { drawPieChart, PieChartItem } from "../PieChart/PieChart";

/**
 * Image: https://eperezcosano.github.io/hex-grid/
 */

interface Props {
  width: number;
  height: number;
}

const HEXAGON_ANGLE = (2 * Math.PI) / 6;

function getYStartCoordsForAllLines(
  height: number,
  hexagonRadius: number
): number[] {
  const yStartCoords = [];
  let y = hexagonRadius * Math.sin(HEXAGON_ANGLE);
  while (y + 2 * hexagonRadius * Math.sin(HEXAGON_ANGLE) < height) {
    yStartCoords.push(y);
    y += 2 * hexagonRadius * Math.sin(HEXAGON_ANGLE);
  }
  return yStartCoords;
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexagonRadius: number,
  cellInnerRadius: number
): void {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.strokeStyle = "#cccccc";
    ctx.lineTo(
      x + hexagonRadius * Math.cos(HEXAGON_ANGLE * i),
      y + hexagonRadius * Math.sin(HEXAGON_ANGLE * i)
    );
  }
  ctx.closePath();
  ctx.stroke();
  drawPieChart(ctx, getPieChartContent(), x, y, cellInnerRadius);
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hexagonRadius: number,
  cellInnerRadius: number
): void {
  ctx.clearRect(0, 0, width, height);
  const yStartCoords = getYStartCoordsForAllLines(height, hexagonRadius);
  yStartCoords.forEach((y) => {
    let x = hexagonRadius;
    let j = 0;
    while (x + hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE)) < width) {
      const markerRadius = getRandomMarkerSize(cellInnerRadius);
      drawHexagon(ctx, x, y, hexagonRadius, markerRadius);
      x += hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE));
      y += (-1) ** j * hexagonRadius * Math.sin(HEXAGON_ANGLE);
      j++;
    }
  });
}

function getRandomMarkerSize(max: number): number {
  return Math.max(Math.random() * max, MIN_CELL_RADIUS);
}

function getPieChartContent(): PieChartItem[] {
  const colors = [
    { value: 1, label: "1", color: "#f06292" },
    { value: 1, label: "2", color: "#4db6ac" },
    { value: 1, label: "3", color: "#ffb74d" },
    { value: 1, label: "3", color: "#ff8a65" },
    { value: 1, label: "3", color: "#aed581" },
    { value: 1, label: "3", color: "#4dd0e1" },
    { value: 1, label: "3", color: "#7986cb" },
    { value: 1, label: "3", color: "#e57373" },
  ]
    .sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
    .map((item) => ({ ...item, value: Math.random() }));
  return colors.slice(0, Math.random() * colors.length);
}

const CanvasGrid: FunctionComponent<Props> = ({ width, height }) => {
  const { cellOuterRadius, cellInnerRadius } = useGridSellSize();

  function draw(ctx: CanvasRenderingContext2D): void {
    return drawGrid.call(
      null,
      ctx,
      width,
      height,
      cellOuterRadius,
      cellInnerRadius
    );
  }

  return <Canvas draw={draw} width={width} height={height} />;
};

export default CanvasGrid;
