import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FunctionComponent, useEffect, useRef } from "react";
import {
  ActionKind,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import styles from "./Map.module.css";

const Map: FunctionComponent = () => {
  const dispatch = useGridSellSizeDispatch();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null as any);
  const lng = 30.32;
  const lat = 59.94;
  const zoom = 5;
  const API_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";

  function handleZoomChange(zoomLevel: number): void {
    dispatch({
      type: ActionKind.ZoomChange,
      payload: zoomLevel,
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
    }) as maplibregl.Map;
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.on("zoomstart", () => {
      handleZoomChange(map.current.getZoom());
    });
    map.current.on("zoomend", () => {
      handleZoomChange(map.current.getZoom());
    });
  });

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
};

export default Map;
