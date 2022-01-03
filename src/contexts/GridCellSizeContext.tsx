import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";

export type State = {
  value: number;
};

export const enum ActionKind {
  Change = "CHANGE",
}

export type Action = {
  type: ActionKind;
  payload: number;
};

const initialCellSize: State = {
  value: 100,
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

function tasksReducer(cellSize: State, action: Action): State {
  switch (action.type) {
    case ActionKind.Change: {
      return {
        value: action.payload,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export function useGridSellSize() {
  return useContext(GridSellSizeContext);
}

export function useGridSellSizeDispatch() {
  return useContext(GridSellDispatchContext);
}
