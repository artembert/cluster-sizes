import { ChangeEvent, FunctionComponent } from "react";
import {
  ActionKind,
  useGridSellSize,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import styles from "./Sidebar.module.css";

const Sidebar: FunctionComponent = () => {
  const dispatchGridCellSize = useGridSellSizeDispatch();
  const { cellOuterRadius } = useGridSellSize();

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
            <td>9</td>
          </tr>
          <tr>
            <td>cell-size</td>
            <td>
              <input
                value={cellOuterRadius}
                type="number"
                onChange={handleCellSizeChange}
              />
            </td>
          </tr>
          <tr>
            <td>marker-radius</td>
            <td>15 px</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Sidebar;
