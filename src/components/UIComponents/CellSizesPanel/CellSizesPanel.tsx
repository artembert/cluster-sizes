import { ChangeEvent, FunctionComponent } from "react";
import {
  DefinedZoomLevel,
  useCellSize,
  useCellSizeDispatch,
} from "../../../contexts/CellSizeContext";
import { ActionKind } from "../../../contexts/models/action-kind.constant";
import styles from "./CellSizesPanel.module.css";

const CellSizesPanel: FunctionComponent = () => {
  const cellSizes = useCellSize();
  const dispatch = useCellSizeDispatch();
  const sizes = Object.entries(cellSizes) as [DefinedZoomLevel, number][];

  function handleCellSizeChange(
    zoomLevel: DefinedZoomLevel,
    e: ChangeEvent<HTMLInputElement>
  ): void {
    const value = e.target.valueAsNumber;
    console.log(value);
    if (!value) {
      return;
    }
    dispatch({
      type: ActionKind.CellSize,
      payload: {
        zoomLevel,
        metersInCell: value,
      },
    });
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              <strong>zoom level</strong>
            </td>
            <td>
              <strong>cell size, m</strong>
            </td>
          </tr>
          {sizes.map(([zoomLevel, size]) => (
            <tr key={zoomLevel}>
              <td className={styles.zoomLevel}>{zoomLevel}</td>
              <td>
                <input
                  type="number"
                  className={styles.input}
                  onChange={(e) => handleCellSizeChange(zoomLevel, e)}
                  value={size}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CellSizesPanel;
function dispatchCellSize(arg0: {
  type: ActionKind;
  payload: { outerRadius: number };
}) {
  throw new Error("Function not implemented.");
}
