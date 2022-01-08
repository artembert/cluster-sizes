import { ChangeEvent, FunctionComponent } from "react";
import {
  ActionKind,
  MIN_CELL_RADIUS,
  useGridSellSize,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
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
      <table>
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
            <td>cell-size</td>
            <td>
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
            <td>
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
    </div>
  );
};

export default Sidebar;
