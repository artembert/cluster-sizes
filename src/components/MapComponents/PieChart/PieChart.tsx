export interface PieChartItem {
  label: string;
  value: number;
  color: string;
}

const pieChartSizes = {
  radius: 20,
  borderWidth: 4,
};

const degreeToRadians: (angle: number) => number = (angle) => {
  return (angle * Math.PI) / 180;
};

const getTotal: (data: PieChartItem[]) => number = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].value;
  }

  return sum;
};

const calculateStart: (
  data: PieChartItem[],
  index: number,
  total: number
) => number = (data, index, total) => {
  if (index === 0) {
    return 0;
  }

  return calculateEnd(data, index - 1, total);
};

const calculateEndAngle: (
  data: PieChartItem[],
  index: number,
  total: number
) => number = (data, index, total) => {
  const angle = (data[index].value / total) * 360;
  const inc = index === 0 ? 0 : calculateEndAngle(data, index - 1, total);

  return angle + inc;
};

const calculateEnd: (
  data: PieChartItem[],
  index: number,
  total: number
) => number = (data, index, total) => {
  return degreeToRadians(calculateEndAngle(data, index, total));
};

function clipCenterCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  markerRadius: number,
  borderWidth: number = pieChartSizes.borderWidth
): void {
  if (borderWidth > markerRadius) {
    console.error("Border should be smaller then marker radius");
  }
  /// save context for clipping
  ctx.save();

  /// create path
  ctx.beginPath();
  ctx.arc(x, y, markerRadius - borderWidth, 0, 2 * Math.PI);
  ctx.closePath();

  /// set clipping mask based on shape
  ctx.clip();

  /// clear anything inside it
  ctx.clearRect(0, 0, x * 2, y * 2);

  /// remove clipping mask
  ctx.restore();
}

export function drawPieChart(
  ctx: CanvasRenderingContext2D,
  data: PieChartItem[],
  x: number,
  y: number,
  radius: number = pieChartSizes.radius
) {
  const total = getTotal(data);

  let startAngle, endAngle;

  for (let i = 0; i < data.length; i++) {
    startAngle = calculateStart(data, i, total);
    endAngle = calculateEnd(data, i, total);

    ctx.beginPath();
    ctx.fillStyle = data[i].color;
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    ctx.closePath();
  }
  clipCenterCircle(ctx, x, y, radius);
}
