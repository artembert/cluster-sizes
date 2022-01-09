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
          <td>zoom-level</td>
          <td>
            <input
              value={zoomLevel.toFixed(2)}
              type="text"
              className={styles.input}
              disabled
            />
          </td>
        </tr>
        <tr>
          <td>cell radius</td>
          <td
            className={styles.associatedField}
            style={{ backgroundColor: pxColor }}
          >
            <input
              value={cellOuterRadius.toFixed(0)}
              type="text"
              className={styles.input}
              min={MIN_CELL_RADIUS}
              disabled
            />
            &nbsp;px
          </td>
        </tr>
        <tr>
          <td></td>
          <td
            className={styles.associatedField}
            style={{ backgroundColor: metersColor }}
          >
            <input
              value={cellSizeInMeters.toFixed(0)}
              type="text"
              className={styles.input}
              disabled
            />
            &nbsp;m
          </td>
        </tr>
        <tr>
          <td>
            max <br />
            marker-radius
          </td>
          <td>
            <input
              value={cellInnerRadius.toFixed(0)}
              type="text"
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
