import { FunctionComponent } from "react";
import { useGridSellSize } from "../../../contexts/GridCellSizeContext";
import Canvas from "../Canvas/Canvas";

interface Props {
  width: number;
  height: number;
}

const HEXAGON_ANGLE = (2 * Math.PI) / 6;

const CanvasGrid: FunctionComponent<Props> = ({ width, height }) => {
  const { value: gridSellSize } = useGridSellSize();
  const hexagonRadius = gridSellSize / 2;
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
      let y = hexagonRadius;
    while (y + hexagonRadius * Math.sin(HEXAGON_ANGLE) < height) {
      let x = hexagonRadius;
      let j = 0;
      while (x + hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE)) < width) {
        drawHexagon(ctx, x, y);
        x += hexagonRadius * (1 + Math.cos(HEXAGON_ANGLE));
        y += (-1) ** j * hexagonRadius * Math.sin(HEXAGON_ANGLE);
        j++;
      }

      y += hexagonRadius * Math.sin(HEXAGON_ANGLE);
    }
  };

  const draw: (ctx: CanvasRenderingContext2D) => void = (ctx) => {
    return drawGrid.call(null, ctx, width, height);
  };

  return <Canvas draw={draw} width={width} height={height} />;
};

export default CanvasGrid;
