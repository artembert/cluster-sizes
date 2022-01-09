import { ChangeEvent, FunctionComponent } from "react";
import {
  ActionKind,
  MIN_CELL_RADIUS,
  useGridSellSize,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import ProfilePlot, { metersColor, pxColor } from "../ProfilePlot/ProfilePlot";
import styles from "./Sidebar.module.css";

const Sidebar: FunctionComponent = () => {
  const dispatchGridCellSize = useGridSellSizeDispatch();
  const { cellOuterRadius, cellInnerRadius, zoomLevel, cellSizeInMeters } =
    useGridSellSize();

  function handleCellSizeChange(e: ChangeEvent<HTMLInputElement>) {
    dispatchGridCellSize({
      type: ActionKind.Change,
      payload: {
        outerRadius: e.target.valueAsNumber,
      },
    });
  }

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
                onChange={handleCellSizeChange}
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
      <div className={styles.profilePlot}>
        <ProfilePlot width={240} height={300} />
      </div>
    </div>
  );
};

export default Sidebar;
