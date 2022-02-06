export function CanvasPoint(size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  ctx.moveTo(x, y);
  ctx.arc(x, y, y, 0, 360);
  ctx.fill();
  clipCenterCircle(ctx);

  return canvas;
}

function clipCenterCircle(
  ctx: CanvasRenderingContext2D,
  borderWidth: number = 2
): void {
  const [x, y] = [ctx.canvas.width / 2, ctx.canvas.height / 2];

  /// save context for clipping
  ctx.save();

  /// create path
  ctx.beginPath();
  ctx.arc(x, y, y - borderWidth, 0, 2 * Math.PI);
  ctx.closePath();

  /// set clipping mask based on shape
  ctx.clip();

  /// clear anything inside it
  ctx.clearRect(0, 0, x * 2, y * 2);

  /// remove clipping mask
  ctx.restore();
}
