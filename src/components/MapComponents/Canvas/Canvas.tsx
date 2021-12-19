import { FunctionComponent, useEffect, useRef } from "react";

/**
 * Source: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
 */


interface Props {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void
}

const Canvas: FunctionComponent<Props> = ({draw}) => {
  

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

    const rednerCanvas = () => {
      frameCount++;
      draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(rednerCanvas);
    };
    rednerCanvas();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} width="700" height="500" id="canvas-grid"></canvas>
  );
};

export default Canvas;
