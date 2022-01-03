import { FunctionComponent } from "react";
import { useGridSellSize } from "../../../contexts/GridCellSizeContext";
import Canvas from "../Canvas/Canvas";
import { drawPieChart } from "../PieChart/PieChart";

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
  hexagonRadius: number
): void {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(
      x + hexagonRadius * Math.cos(HEXAGON_ANGLE * i),
      y + hexagonRadius * Math.sin(HEXAGON_ANGLE * i)
    );
  }
  ctx.closePath();
  ctx.stroke();
  drawPieChart(
    ctx,
    [
      { value: 1, label: "1", color: "#f06292" },
      { value: 1, label: "2", color: "#4db6ac" },
      { value: 1, label: "3", color: "#ffb74d" },
    ],
    x,
    y
  );
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hexagonRadius: number
): void {
  ctx.clearRect(0, 0, width, height);
  const yStartCoords = getYStartCoordsForAllLines(height, hexagonRadius);
  yStartCoords.forEach((y) => {
    let x = hexagonRadius;
    let j = 0;
    while (x + hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE)) < width) {
      drawHexagon(ctx, x, y, hexagonRadius);
      x += hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE));
      y += (-1) ** j * hexagonRadius * Math.sin(HEXAGON_ANGLE);
      j++;
    }
  });
}

const CanvasGrid: FunctionComponent<Props> = ({ width, height }) => {
  const { value: gridSellSize } = useGridSellSize();
  const hexagonRadius = gridSellSize / 2;

  function draw(ctx: CanvasRenderingContext2D): void {
    return drawGrid.call(null, ctx, width, height, hexagonRadius);
  }

  return <Canvas draw={draw} width={width} height={height} />;
};

export default CanvasGrid;
