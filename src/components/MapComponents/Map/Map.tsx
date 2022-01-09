import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FunctionComponent, useEffect, useRef } from "react";
import {
  MetersCellSizes,
  useCellSize,
} from "../../../contexts/CellSizeContext";
import {
  INITIAL_LATITUDE,
  INITIAL_ZOOM_LEVEL,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import { ActionKind } from "../../../contexts/models/action-kind.constant";
import styles from "./Map.module.css";

const Map: FunctionComponent = () => {
  const dispatch = useGridSellSizeDispatch();
  const sellCizes = useCellSize();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null as any);
  const lng = 30.32;
  const lat = INITIAL_LATITUDE;
  const zoom = INITIAL_ZOOM_LEVEL;
  const API_KEY = "WG5WfHW7QZ4Jd8QZ6hkg";

  function handleZoomChange({
    zoomLevel,
    lat,
    sellCizes,
  }: {
    zoomLevel: number;
    lat: number;
    sellCizes: MetersCellSizes;
  }): void {
    dispatch({
      type: ActionKind.ZoomEnd,
      payload: {
        lat,
        zoomLevel,
        sellCizes,
      },
    });
  }

  function handleZoomStart(): void {
    dispatch({
      type: ActionKind.ZoomStart,
      payload: undefined,
    });
  }

  useEffect(() => {
    if (!map || !mapContainer || !mapContainer.current || map.current) {
      return;
    }
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
      minZoom: 5,
    }) as maplibregl.Map;
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.on("zoomstart", () => {
      handleZoomStart();
    });
    map.current.on("dragstart", () => {
      handleZoomStart();
    });
    map.current.on("dragend", () => {
      handleZoomChange({
        zoomLevel: map.current.getZoom(),
        lat: map.current.getCenter().lat,
        sellCizes,
      });
    });
    map.current.on("zoomend", () => {
      handleZoomChange({
        zoomLevel: map.current.getZoom(),
        lat: map.current.getCenter().lat,
        sellCizes,
      });
    });
  });

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
};

export default Map;
