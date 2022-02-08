export interface PieChartItem {
  label: string;
  value: number;
  color: string;
}

const pieChartSizes = {
  diameter: 20,
  borderWidth: 8,
};

export function CanvasPoint(
  data: PieChartItem[],
  size = pieChartSizes.diameter
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const total = getTotal(data);

  let startAngle, endAngle;

  for (let i = 0; i < data.length; i++) {
    startAngle = calculateStart(data, i, total);
    endAngle = calculateEnd(data, i, total);

    ctx.beginPath();
    ctx.fillStyle = data[i].color;
    ctx.moveTo(x, y);
    ctx.arc(x, y, y, startAngle, endAngle);
    ctx.fill();
  }
  clipCenterCircle(ctx);

  return canvas;
}

function clipCenterCircle(
  ctx: CanvasRenderingContext2D,
  borderWidth: number = pieChartSizes.borderWidth
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

function degreeToRadians(angle: number): number {
  return (angle * Math.PI) / 180;
}

function getTotal(data: PieChartItem[]): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].value;
  }

  return sum;
}

function calculateStart(
  data: PieChartItem[],
  index: number,
  total: number
): number {
  if (index === 0) {
    return 0;
  }

  return calculateEnd(data, index - 1, total);
}

function calculateEndAngle(
  data: PieChartItem[],
  index: number,
  total: number
): number {
  const angle = (data[index].value / total) * 360;
  const inc = index === 0 ? 0 : calculateEndAngle(data, index - 1, total);

  return angle + inc;
}

function calculateEnd(
  data: PieChartItem[],
  index: number,
  total: number
): number {
  return degreeToRadians(calculateEndAngle(data, index, total));
}
