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
  const { cellOuterRadius, cellInnerRadius, zoomLevel } = useGridSellSize();

  function handleCellSizeChange(e: ChangeEvent<HTMLInputElement>) {
    dispatchGridCellSize({
      type: ActionKind.Change,
      payload: e.target.valueAsNumber,
    });
  }

  return (
    <div className={styles.layout}>
      <table>
        <tbody>
          <tr>
            <td>zoom-level</td>
            <td>
              <input value={zoomLevel.toFixed(2)} type="number" disabled />
            </td>
          </tr>
          <tr>
            <td>cell-size</td>
            <td>
              <input
                value={cellOuterRadius}
                type="number"
                min={MIN_CELL_RADIUS}
                onChange={handleCellSizeChange}
              />
              px
            </td>
          </tr>
          <tr>
            <td>marker-radius</td>
            <td>
              <input
                value={cellInnerRadius.toFixed(1)}
                type="number"
                disabled
              />
              px
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Sidebar;
