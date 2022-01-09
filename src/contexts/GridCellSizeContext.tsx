import {
  createContext,
  Dispatch,
  FunctionComponent,
  useContext,
  useReducer,
} from "react";
import { getCellSizeInMetersByZoom } from "../geo-helpers/grid-cell-size-by-zoom.helper";
import { getPixelsFromMeters } from "../geo-helpers/meters-per-pixels.helper";
import { initialCellSizes } from "./CellSizeContext";
import { ActionKind } from "./models/action-kind.constant";
import {
  ZoomChangeStartAction,
  ZoomEndAction,
} from "./models/actions.interfaces";

export const MIN_CELL_RADIUS = 10;
export const MAX_CELL_RADIUS = 80;
export const INITIAL_ZOOM_LEVEL = 9.01;
export const INITIAL_LATITUDE = 59.94;

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

export type Action = ZoomEndAction | ZoomChangeStartAction;

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
      cellSizes: action.payload.sellCizes,
    });
    const cellOuterRadius = getPixelsFromMeters({
      zoomLevel: action.payload.zoomLevel,
      lat: action.payload.lat,
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
