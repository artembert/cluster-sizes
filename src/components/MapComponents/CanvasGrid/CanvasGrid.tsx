import { FunctionComponent } from "react";
import { useGridSellSize } from "../../../contexts/GridCellSizeContext";
import Canvas from "../Canvas/Canvas";

interface Props {
  width: number;
  height: number;
}

const HEXAGON_ANGLE = (2 * Math.PI) / 6;

const getYStartCoordsForAllLines: (
  height: number,
  hexagonRadius: number
) => number[] = (height, hexagonRadius) => {
  const yStartCoords = [];
  let y = hexagonRadius * Math.sin(HEXAGON_ANGLE);
  while (y < height) {
    yStartCoords.push(y);
    y += 2 * hexagonRadius * Math.sin(HEXAGON_ANGLE);
  }
  return yStartCoords;
};

const CanvasGrid: FunctionComponent<Props> = ({ width, height }) => {
  const { value: gridSellSize } = useGridSellSize();
  const hexagonRadius = gridSellSize / 2;
  const yStartCoords = getYStartCoordsForAllLines(height, hexagonRadius);

  const drawHexagon: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => void = (ctx, x, y) => {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(
        x + hexagonRadius * Math.cos(HEXAGON_ANGLE * i),
        y + hexagonRadius * Math.sin(HEXAGON_ANGLE * i)
      );
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawGrid: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => void = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    yStartCoords.forEach((y) => {
      let x = hexagonRadius;
      let j = 0;
      while (x + hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE)) < width) {
        drawHexagon(ctx, x, y);
        x += hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE));
        y += (-1) ** j * hexagonRadius * Math.sin(HEXAGON_ANGLE);
        j++;
      }
    });
  };

  const draw: (ctx: CanvasRenderingContext2D) => void = (ctx) => {
    return drawGrid.call(null, ctx, width, height);
  };

  return <Canvas draw={draw} width={width} height={height} />;
};

export default CanvasGrid;
