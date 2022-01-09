import { FunctionComponent } from "react";
import {
  MIN_CELL_RADIUS,
  useGridSellSize,
} from "../../../contexts/GridCellSizeContext";
import CellSizesPanel from "../CellSizesPanel/CellSizesPanel";
import ProfilePlot, { metersColor, pxColor } from "../ProfilePlot/ProfilePlot";
import styles from "./Sidebar.module.css";

const Sidebar: FunctionComponent = () => {
  const { cellOuterRadius, cellInnerRadius, zoomLevel, cellSizeInMeters } =
    useGridSellSize();

  return (
    <div className={styles.layout}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>zoom-level</td>
            <td>
              <input
                value={zoomLevel.toFixed(2)}
                type="number"
                className={styles.input}
                disabled
              />
            </td>
          </tr>
          <tr>
            <td>Cell radius</td>
            <td
              className={styles.associatedField}
              style={{ backgroundColor: pxColor }}
            >
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
            <td></td>
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
            <td>max marker-radius</td>
            <td>
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
      <div>
        <CellSizesPanel />
      </div>
      <div className={styles.profilePlot}>
        <ProfilePlot width={340} height={300} />
      </div>
      <div className={styles.disclaimer}>
        <div>
          <strong>Disclaimer</strong>
        </div>
        <div>
          <span>Clusters are randomly generated</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
