import { FunctionComponent } from "react";
import {
  MIN_CELL_RADIUS,
  useGridSellSize,
} from "../../../contexts/GridCellSizeContext";
import { metersColor, pxColor } from "../ProfilePlot/ProfilePlot";
import styles from "./MapMetadata.module.css";

const MapMetadata: FunctionComponent = () => {
  const { cellOuterRadius, cellInnerRadius, zoomLevel, cellSizeInMeters } =
    useGridSellSize();

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>
            <div>zoom-level</div>
            <input
              value={zoomLevel.toFixed(2)}
              type="number"
              className={styles.input}
              disabled
            />
          </td>
        </tr>
        <tr>
          <td
            className={styles.associatedField}
            style={{ backgroundColor: pxColor }}
          >
            <div> Cell radius</div>
            <input
              value={cellOuterRadius.toFixed(2)}
              type="number"
              className={styles.input}
              min={MIN_CELL_RADIUS}
              disabled
            />
            &nbsp;px
          </td>
        </tr>
        <tr>
          <td
            className={styles.associatedField}
            style={{ backgroundColor: metersColor }}
          >
            <input
              value={cellSizeInMeters.toFixed(2)}
              type="number"
              className={styles.input}
              disabled
            />
            &nbsp;m
          </td>
        </tr>
        <tr>
          <td>
            <div>max marker-radius</div>
            <input
              value={cellInnerRadius.toFixed(2)}
              type="number"
              className={styles.input}
              disabled
            />
            &nbsp;px
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MapMetadata;
