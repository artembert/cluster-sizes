import produce from "immer";
import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";
import { ActionKind } from "./models/action-kind.constant";

export const MIN_CELL_RADIUS = 10;
export const MAX_CELL_RADIUS = 80;
export const INITIAL_ZOOM_LEVEL = 9;
export const INITIAL_LATITUDE = 59.94;
export const MAX_CLUSTER_ZOOM_LEVEL = 14;
export const MAX_MARKER_DIAMETER = 80;
export const MIN_MARKER_DIAMETER = 50;

interface Action {
  type: ActionKind.CellSize;
  payload: CellCizePayload;
}

export type DefinedZoomLevel =
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "13.5"
  | "14"
  | "15";

export type MetersCellSizes = Record<DefinedZoomLevel, number>;

interface CellCizePayload {
  zoomLevel: DefinedZoomLevel;
  metersInCell: number;
}

export const initialCellSizes: MetersCellSizes = {
  "5": 192000,
  "6": 96000,
  "7": 48000,
  "8": 24000,
  "9": 12000,
  "10": 6000,
  "11": 3000,
  "12": 1500,
  "13": 1000,
  "13.5": 500,
  "14": 100,
  "15": 100,
};

export const CellSizeContext = createContext(initialCellSizes);
export const SellSizeDispatchContext = createContext<Dispatch<Action>>(
  null as any
);

export const SellSizeProvider: FunctionComponent = ({ children }) => {
  const [cellSize, dispatch] = useReducer(reducer, initialCellSizes);

  return (
    <CellSizeContext.Provider value={cellSize}>
      <SellSizeDispatchContext.Provider value={dispatch}>
        {children}
      </SellSizeDispatchContext.Provider>
    </CellSizeContext.Provider>
  );
};

function reducer(prevState: MetersCellSizes, action: Action): MetersCellSizes {
  return produce(prevState, (draft) => {
    draft[action.payload.zoomLevel] = action.payload.metersInCell;
  });
}

export function useCellSize() {
  return useContext(CellSizeContext);
}

export function useCellSizeDispatch() {
  return useContext(SellSizeDispatchContext);
}
