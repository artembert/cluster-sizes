import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";
import { getMetersPerPixel } from "../geo-helpers/meters-per-pixels.helper";

const INITIAL_CELL_OUTER_RADIUS = 50;
export const MIN_CELL_RADIUS = 10;
export const INITIAL_ZOOM_LEVEL = 5;
export const INITIAL_LATITUDE = 59.94;

interface BaseAction<Payload extends unknown> {
  type: ActionKind;
  payload: Payload;
}

export type State = {
  cellOuterRadius: number;
  cellInnerRadius: number;
  zoomLevel: number;
  cellSizeInMeters: number;
  isGridVisible: boolean;
};

export const enum ActionKind {
  Change = "CHANGE",
  ZoomEnd = "ZOOM_END",
  ZoomStart = "ZOOM_START",
}

interface CellOuterRadiusChangePayload {
  outerRadius: number;
}

export interface CellOuterRadiusChangeAction
  extends BaseAction<CellOuterRadiusChangePayload> {
  type: ActionKind.Change;
  payload: {
    outerRadius: number;
  };
}

interface ZoomChangePayload {
  zoomLevel: number;
  lat: number;
}

export interface ZoomEndAction extends BaseAction<ZoomChangePayload> {
  type: ActionKind.ZoomEnd;
  payload: {
    zoomLevel: number;
    lat: number;
  };
}

export interface ZoomChangeStartAction extends BaseAction<undefined> {
  type: ActionKind.ZoomStart;
  payload: undefined;
}

export type Action =
  | ZoomEndAction
  | ZoomChangeStartAction
  | CellOuterRadiusChangeAction;

const initialCellSize: State = {
  cellOuterRadius: INITIAL_CELL_OUTER_RADIUS,
  cellInnerRadius: getHexagonInnerCirclieRadius(INITIAL_CELL_OUTER_RADIUS),
  zoomLevel: INITIAL_ZOOM_LEVEL,
  cellSizeInMeters:
    getMetersPerPixel({
      latitude: INITIAL_LATITUDE,
      zoomLevel: INITIAL_ZOOM_LEVEL,
    }) * INITIAL_CELL_OUTER_RADIUS,
  isGridVisible: true,
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

function tasksReducer(prevState: State, action: Action): State {
  if (isCellOuterRadiusChangeAction(action)) {
    return {
      ...prevState,
      cellOuterRadius: action.payload.outerRadius,
      cellInnerRadius: getHexagonInnerCirclieRadius(action.payload.outerRadius),
    };
  }
  if (isZoomChangeAction(action)) {
    return {
      ...prevState,
      isGridVisible: true,
      zoomLevel: action.payload.zoomLevel,
      cellSizeInMeters:
        getMetersPerPixel({
          latitude: action.payload.lat,
          zoomLevel: action.payload.zoomLevel,
        }) * prevState.cellOuterRadius,
    };
  }
  if (isZoomChangeStartAction(action)) {
    return {
      ...prevState,
      isGridVisible: false,
    };
  }

  throw Error("Unknown action: " + action);
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

function isZoomChangeAction(action: Action): action is ZoomEndAction {
  return action.type === ActionKind.ZoomEnd;
}

function isZoomChangeStartAction(
  action: Action
): action is ZoomChangeStartAction {
  return action.type === ActionKind.ZoomStart;
}

function isCellOuterRadiusChangeAction(
  action: Action
): action is CellOuterRadiusChangeAction {
  return action.type === ActionKind.Change;
}
