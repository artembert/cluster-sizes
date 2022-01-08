import { FunctionComponent } from "react";
import { INITIAL_LATITUDE } from "../../../contexts/GridCellSizeContext";
import { getCellSizeInMetersByZoom } from "../../../geo-helpers/grid-cell-size-by-zoom.helper";
import { getPixelsFromMeters } from "../../../geo-helpers/meters-per-pixels.helper";
import Canvas from "../../MapComponents/Canvas/Canvas";
import styles from "./ProfilePlot.module.css";

interface Props {
  width: number;
  height: number;
}

export const metersColor = "#FFA000";
export const pxColor = "#03A9F4";
const bottomLabelPadding = 10;
const bottomValuesLabelsPadding = 50;
const zoomLevels = Array.from({ length: 45 })
  .fill(undefined)
  .map((_, index) => 0.25 * index)
  .slice(25);
const firstLineIndent = 6;
const font = "12px sans-serif";
console.log(zoomLevels);

function drawPlot(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  clearGrid(ctx, width, height);
  const cellSizes = zoomLevels.map((zoomLevel) => ({
    zoomLevel,
    cellSizeInMeters: getCellSizeInMetersByZoom({
      zoomLevel,
      lat: INITIAL_LATITUDE,
    }),
    cellSizeInPx: getPixelsFromMeters({
      lat: INITIAL_LATITUDE,
      zoomLevel,
      meters: getCellSizeInMetersByZoom({ zoomLevel, lat: INITIAL_LATITUDE }),
    }),
  }));
  const indentBetweenLines = Math.floor(width / cellSizes.length);
  const metersMaxHeight = Math.max(...cellSizes.map((_) => _.cellSizeInMeters));
  const pxMaxHeight = Math.max(...cellSizes.map((_) => _.cellSizeInPx));
  const chartHeight = height - bottomValuesLabelsPadding - bottomLabelPadding;
  cellSizes.forEach(({ zoomLevel, cellSizeInMeters, cellSizeInPx }, index) => {
    renderCellInMeters({
      ctx,
      index,
      indentBetweenLines,
      chartHeight,
      cellSizeInMeters,
      metersMaxHeight,
    });
    renderCellInPx({
      ctx,
      index,
      indentBetweenLines,
      chartHeight,
      cellSizeInPx,
      pxMaxHeight,
    });
    renderValueLabel(
      ctx,
      zoomLevel.toFixed(2),
      firstLineIndent + indentBetweenLines * index + 3,
      chartHeight + 3
    );
  });
  renderLabel(ctx, "zoom-level", width / 2, height - bottomLabelPadding);
}

function renderCellInMeters({
  ctx,
  index,
  indentBetweenLines,
  chartHeight,
  cellSizeInMeters,
  metersMaxHeight,
}: {
  ctx: CanvasRenderingContext2D;
  index: number;
  indentBetweenLines: number;
  chartHeight: number;
  cellSizeInMeters: number;
  metersMaxHeight: number;
}): void {
  ctx.beginPath();
  ctx.moveTo(firstLineIndent + indentBetweenLines * index - 2, chartHeight);
  ctx.lineTo(
    firstLineIndent + indentBetweenLines * index - 2,
    chartHeight - (cellSizeInMeters / metersMaxHeight) * chartHeight
  );
  ctx.lineWidth = 4;
  ctx.strokeStyle = metersColor;
  ctx.stroke();
  ctx.closePath();
}

function renderCellInPx({
  ctx,
  index,
  indentBetweenLines,
  chartHeight,
  cellSizeInPx,
  pxMaxHeight,
}: {
  ctx: CanvasRenderingContext2D;
  index: number;
  indentBetweenLines: number;
  chartHeight: number;
  cellSizeInPx: number;
  pxMaxHeight: number;
}): void {
  ctx.beginPath();
  ctx.moveTo(firstLineIndent + indentBetweenLines * index + 2, chartHeight);
  ctx.lineTo(
    firstLineIndent + indentBetweenLines * index + 2,
    chartHeight - (cellSizeInPx / pxMaxHeight) * chartHeight
  );
  ctx.strokeStyle = pxColor;
  ctx.stroke();

  ctx.closePath();
}

function renderValueLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "right";
  ctx.font = font;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function renderLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
): void {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = font;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function clearGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

const ProfilePlot: FunctionComponent<Props> = ({ width, height }) => {
  function draw(ctx: CanvasRenderingContext2D): void {
    return drawPlot.call(null, ctx, width, height);
  }

  return (
    <div className={styles.container}>
      <div className={styles.plot}>
        <Canvas draw={draw} width={width} height={height} />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span
            className={styles.marker}
            style={{ backgroundColor: metersColor }}
          ></span>
          <span className={styles.label}>Cell radius, m</span>
        </div>
        <div className={styles.legendItem}>
          <span
            className={styles.marker}
            style={{ backgroundColor: pxColor }}
          ></span>
          <span className={styles.label}>Cell radius, px</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePlot;
