import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FunctionComponent, useEffect, useRef } from "react";
import {
  ActionKind,
  INITIAL_LATITUDE,
  INITIAL_ZOOM_LEVEL,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import styles from "./Map.module.css";

const Map: FunctionComponent = () => {
  const dispatch = useGridSellSizeDispatch();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null as any);
  const lng = 30.32;
  const lat = INITIAL_LATITUDE;
  const zoom = INITIAL_ZOOM_LEVEL;
  const API_KEY = "WG5WfHW7QZ4Jd8QZ6hkg";

  function handleZoomChange({
    zoomLevel,
    lat,
  }: {
    zoomLevel: number;
    lat: number;
  }): void {
    dispatch({
      type: ActionKind.ZoomEnd,
      payload: {
        lat,
        zoomLevel,
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
      dragPan: false,
    }) as maplibregl.Map;
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.on("zoomstart", () => {
      handleZoomStart();
    });
    map.current.on("zoomend", () => {
      handleZoomChange({
        zoomLevel: map.current.getZoom(),
        lat: map.current.getCenter().lat,
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
