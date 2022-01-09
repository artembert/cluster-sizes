import produce from "immer";
import { ChangeEvent, FunctionComponent, useState } from "react";
import {
  DefinedZoomLevel,
  useCellSize,
  useCellSizeDispatch,
} from "../../../contexts/CellSizeContext";
import { useGridSellSizeDispatch } from "../../../contexts/GridCellSizeContext";
import { ActionKind } from "../../../contexts/models/action-kind.constant";
import styles from "./CellSizesPanel.module.css";

const CellSizesPanel: FunctionComponent = () => {
  const cellSizes = useCellSize();
  const dispatchGrid = useGridSellSizeDispatch();
  const dispatchCellSizeChange = useCellSizeDispatch();
  const [valuesCashe, setValuesCashe] = useState({ ...cellSizes });
  const sizes = Object.entries(valuesCashe).sort((a, b) =>
    +a[0] > +b[0] ? 1 : -1
  ) as [DefinedZoomLevel, number][];

  function handleCellSizeChange(
    zoomLevel: DefinedZoomLevel,
    e: ChangeEvent<HTMLInputElement>
  ): void {
    const value = e.target.valueAsNumber;
    setValuesCashe(
      produce(valuesCashe, (draft) => {
        draft[zoomLevel] = value;
      })
    );
  }

  function handleCellSizeBlur(zoomLevel: DefinedZoomLevel): void {
    const value = valuesCashe[zoomLevel];
    if (!value || value < 100) {
      setValuesCashe(cellSizes);
      return;
    }
    dispatchCellSizeChange({
      type: ActionKind.CellSize,
      payload: {
        zoomLevel,
        metersInCell: value,
      },
    });
    dispatchGrid({
      type: ActionKind.Refresh,
      payload: {
        cellSizes: valuesCashe,
      },
    });
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.label}>
              <strong>
                zoom <br />
                level
              </strong>
            </td>
            <td className={styles.label}>
              <strong>
                cell <br />
                radius, m
              </strong>
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
                  onBlur={() => handleCellSizeBlur(zoomLevel)}
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
