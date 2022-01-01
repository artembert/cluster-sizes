import { FunctionComponent, useEffect, useRef } from "react";

/**
 * Source: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
 */

interface Props {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  width?: number;
  height?: number;
}

const Canvas: FunctionComponent<Props> = ({
  draw,
  width = 800,
  height = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let frameCount = 0;
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const probablyCtx = canvas.getContext("2d");
    if (!probablyCtx) {
      return;
    }
    const ctx = probablyCtx;
    const { devicePixelRatio: ratio = 1 } = window;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(ratio, ratio);

    const rednerCanvas = () => {
      frameCount++;
      draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(rednerCanvas);
    };
    rednerCanvas();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, width, height]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
