import produce from "immer";
import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";
import { getCellSizeInMetersByZoom } from "../geo-helpers/grid-cell-size-by-zoom.helper";
import { getPixelsFromMeters } from "../geo-helpers/get-pixels-from.meters";
import { initialCellSizes } from "./CellSizeContext";
import { ActionKind } from "./models/action-kind.constant";
import {
  RefreshAction,
  ZoomChangeStartAction,
  ZoomEndAction,
} from "./models/actions.interfaces";

export const MIN_CELL_RADIUS = 10;
export const MAX_CELL_RADIUS = 80;
export const INITIAL_ZOOM_LEVEL = 7.9;
export const INITIAL_LATITUDE = 55.760119;
export const INITIAL_LON = 37.619073;
export const MARKER_RADIUS = 40;

export interface BaseAction<Payload extends unknown> {
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

export type Action = ZoomEndAction | ZoomChangeStartAction | RefreshAction;

const initialCellOuterRadius = getPixelsFromMeters({
  lat: INITIAL_LATITUDE,
  zoomLevel: INITIAL_ZOOM_LEVEL,
  meters: getCellSizeInMetersByZoom({
    zoomLevel: INITIAL_ZOOM_LEVEL,
    cellSizes: initialCellSizes,
  }),
});

const initialState: State = {
  cellOuterRadius: initialCellOuterRadius,
  cellInnerRadius: getHexagonInnerCirclieRadius(initialCellOuterRadius),
  zoomLevel: INITIAL_ZOOM_LEVEL,
  cellSizeInMeters: getCellSizeInMetersByZoom({
    zoomLevel: INITIAL_ZOOM_LEVEL,
    cellSizes: initialCellSizes,
  }),
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
  if (isZoomEndAction(action)) {
    const meters = getCellSizeInMetersByZoom({
      zoomLevel: action.payload.zoomLevel,
      cellSizes: action.payload.cellSizes,
    });
    const cellOuterRadius = getPixelsFromMeters({
      zoomLevel: action.payload.zoomLevel,
      lat: action.payload.lat,
      meters,
    });
    return produce(prevState, (draft) => {
      draft.isGridVisible = true;
      draft.zoomLevel = action.payload.zoomLevel;
      draft.cellOuterRadius = cellOuterRadius;
      draft.cellInnerRadius = getHexagonInnerCirclieRadius(cellOuterRadius);
      draft.cellSizeInMeters = meters;
    });
  }
  if (isZoomChangeStartAction(action)) {
    return produce(prevState, (draft) => {
      draft.isGridVisible = false;
    });
  }
  if (isRefreshAction(action)) {
    const meters = getCellSizeInMetersByZoom({
      zoomLevel: prevState.zoomLevel,
      cellSizes: action.payload.cellSizes,
    });
    const cellOuterRadius = getPixelsFromMeters({
      zoomLevel: prevState.zoomLevel,
      lat: INITIAL_LATITUDE,
      meters,
    });
    return produce(prevState, (draft) => {
      draft.cellOuterRadius = cellOuterRadius;
      draft.cellInnerRadius = getHexagonInnerCirclieRadius(cellOuterRadius);
      draft.cellSizeInMeters = meters;
    });
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

function isRefreshAction(action: Action): action is RefreshAction {
  return action.type === ActionKind.Refresh;
}

function isZoomChangeStartAction(
  action: Action
): action is ZoomChangeStartAction {
  return action.type === ActionKind.ZoomStart;
}
