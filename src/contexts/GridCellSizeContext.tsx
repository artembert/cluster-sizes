import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";

const INITIAL_CELL_OUTER_RADIUS = 50;
export const MIN_CELL_RADIUS = 5;
const INITIAL_ZOOM_LEVEL = 5;

export type State = {
  cellOuterRadius: number;
  cellInnerRadius: number;
  zoomLevel: number;
};

export const enum ActionKind {
  Change = "CHANGE",
  ZoomChange = "ZOOM_CHANGE",
}

export type Action = {
  type: ActionKind;
  payload: number;
};

const initialCellSize: State = {
  cellOuterRadius: INITIAL_CELL_OUTER_RADIUS,
  cellInnerRadius: getHexagonInnerCirclieRadius(INITIAL_CELL_OUTER_RADIUS),
  zoomLevel: INITIAL_ZOOM_LEVEL,
};

export const GridSellSizeContext = createContext(initialCellSize);
export const GridSellDispatchContext = createContext<Dispatch<Action>>(
  null as any
);

export const GridSellSizeProvider: FunctionComponent = ({ children }) => {
  const [cellSize, dispatch] = useReducer(tasksReducer, initialCellSize);

  return (
    <GridSellSizeContext.Provider value={cellSize}>
      <GridSellDispatchContext.Provider value={dispatch}>
        {children}
      </GridSellDispatchContext.Provider>
    </GridSellSizeContext.Provider>
  );
};

function tasksReducer(prevState: State, { type, payload }: Action): State {
  switch (type) {
    case ActionKind.Change: {
      return {
        ...prevState,
        cellOuterRadius: payload,
        cellInnerRadius: getHexagonInnerCirclieRadius(payload),
      };
    }
    case ActionKind.ZoomChange: {
      return {
        ...prevState,
        zoomLevel: payload,
      };
    }
    default: {
      throw Error("Unknown action: " + type);
    }
  }
}

export function useGridSellSize() {
  return useContext(GridSellSizeContext);
}

export function useGridSellSizeDispatch() {
  return useContext(GridSellDispatchContext);
}

function getHexagonInnerCirclieRadius(hexagonRadius: number): number {
  return (Math.sqrt(3) * hexagonRadius) / 2;
}
