import { FunctionComponent } from "react";
import Canvas from "../Canvas/Canvas";

const CanvasGrid: FunctionComponent = () => {
  const HEXAGON_ANGLE = 2 * Math.PI / 6;
  const HEXAGON_RADIUS = 50;

  const drawHexagon: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => void = (ctx, x, y) => {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(
        x + HEXAGON_RADIUS * Math.cos(HEXAGON_ANGLE * i),
        y + HEXAGON_RADIUS * Math.sin(HEXAGON_ANGLE * i)
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
    ctx.clearRect(0, 0, width, height)
    for (
      let y = HEXAGON_RADIUS;
      y + HEXAGON_RADIUS * Math.sin(HEXAGON_ANGLE) < height;
      y += HEXAGON_RADIUS * Math.sin(HEXAGON_ANGLE)
    ) {
      for (
        let x = HEXAGON_RADIUS, j = 0;
        x + HEXAGON_RADIUS * (1 + Math.cos(HEXAGON_ANGLE)) < width;
        x += HEXAGON_RADIUS * (1 + Math.cos(HEXAGON_ANGLE)),
          y += (-1) ** j++ * HEXAGON_RADIUS * Math.sin(HEXAGON_ANGLE)
      ) {
        drawHexagon(ctx, x, y);
      }
    }
  };

  const draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void = (
    ctx
  ) => {
    return drawGrid.call(null, ctx, 800, 500);
  };

  return <Canvas draw={draw} />;
};

export default CanvasGrid;
