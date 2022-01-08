import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";
import { getCellSizeInMetersByZoom } from "../geo-helpers/grid-cell-size-by-zoom.helper";
import { getPixelsFromMeters } from "../geo-helpers/meters-per-pixels.helper";

export const MIN_CELL_RADIUS = 10;
export const INITIAL_ZOOM_LEVEL = 9;
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

const initialCellOuterRadius = getPixelsFromMeters({
  latitude: INITIAL_LATITUDE,
  zoomLevel: INITIAL_ZOOM_LEVEL,
  meters: getCellSizeInMetersByZoom(INITIAL_ZOOM_LEVEL),
});

const initialState: State = {
  cellOuterRadius: initialCellOuterRadius,
  cellInnerRadius: getHexagonInnerCirclieRadius(initialCellOuterRadius),
  zoomLevel: INITIAL_ZOOM_LEVEL,
  cellSizeInMeters: getCellSizeInMetersByZoom(INITIAL_ZOOM_LEVEL),
  isGridVisible: true,
};

export const GridSellSizeContext = createContext(initialState);
export const GridSellDispatchContext = createContext<Dispatch<Action>>(
  null as any
);

export const GridSellSizeProvider: FunctionComponent = ({ children }) => {
  const [cellSize, dispatch] = useReducer(tasksReducer, initialState);

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
  if (isZoomEndAction(action)) {
    const meters = getCellSizeInMetersByZoom(action.payload.zoomLevel);
    const cellOuterRadius = getPixelsFromMeters({
      zoomLevel: action.payload.zoomLevel,
      latitude: action.payload.lat,
      meters,
    });
    return {
      ...prevState,
      isGridVisible: true,
      zoomLevel: action.payload.zoomLevel,
      cellOuterRadius,
      cellInnerRadius: getHexagonInnerCirclieRadius(cellOuterRadius),
      cellSizeInMeters: meters,
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

function isZoomEndAction(action: Action): action is ZoomEndAction {
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
