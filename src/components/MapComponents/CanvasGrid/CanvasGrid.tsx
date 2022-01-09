import { FunctionComponent } from "react";
import {
  MIN_CELL_RADIUS,
  useGridSellSize,
} from "../../../contexts/GridCellSizeContext";
import { pxColor } from "../../UIComponents/ProfilePlot/ProfilePlot";
import Canvas from "../Canvas/Canvas";
import { drawPieChart, PieChartItem } from "../PieChart/PieChart";

const GRID_CELL_BORDER_COLOR = pxColor;

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
  yStartCoords.push(y);
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
  ctx.strokeStyle = GRID_CELL_BORDER_COLOR;
  for (var i = 0; i < 6; i++) {
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
  clearGrid(ctx, width, height);
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
    const markerRadius = getRandomMarkerSize(cellInnerRadius);
    drawHexagon(ctx, x, y, hexagonRadius, markerRadius);
  });
}

function clearGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
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
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .map((item) => ({ ...item, value: Math.random() }));
  return colors.slice(0, Math.random() * colors.length);
}

const CanvasGrid: FunctionComponent<Props> = ({ width, height }) => {
  const { cellOuterRadius, cellInnerRadius, isGridVisible } = useGridSellSize();

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

  function clear(ctx: CanvasRenderingContext2D): void {
    return clearGrid.call(null, ctx, width, height);
  }

  return (
    <Canvas draw={isGridVisible ? draw : clear} width={width} height={height} />
  );
};

export default CanvasGrid;
