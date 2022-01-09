import { ActionKind } from "./action-kind.constant";
import { BaseAction } from "../GridCellSizeContext";
import { MetersCellSizes } from "../CellSizeContext";

interface ZoomChangePayload {
  zoomLevel: number;
  lat: number;
  sellCizes: MetersCellSizes;
}

export interface ZoomEndAction extends BaseAction<ZoomChangePayload> {
  type: ActionKind.ZoomEnd;
}

export interface ZoomChangeStartAction extends BaseAction<undefined> {
  type: ActionKind.ZoomStart;
  payload: undefined;
}
