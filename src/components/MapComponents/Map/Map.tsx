import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FunctionComponent, useEffect, useRef } from "react";
import { useCellSize } from "../../../contexts/CellSizeContext";
import {
  INITIAL_LATITUDE,
  INITIAL_LON,
  INITIAL_ZOOM_LEVEL,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import { ActionKind } from "../../../contexts/models/action-kind.constant";
import styles from "./Map.module.css";
import { clusterLayers, LayerMetadata } from "../../../data/layers";
import {
  getAvailableZoomLevelsForGrid,
  LayerZoomRestrictions,
} from "../../../geo-helpers/get-available-zoom-levels-for-grid";
import { clusterStyleConfig } from "./marker-config";

const Map: FunctionComponent = () => {
  const dispatch = useGridSellSizeDispatch();
  const cellSizes = useCellSize();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null as any);
  const lng = INITIAL_LON;
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
        cellSizes,
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
    const zoomLevelRestrictions: (LayerMetadata & LayerZoomRestrictions)[] =
      clusterLayers.map((layer) => ({
        ...layer,
        ...getAvailableZoomLevelsForGrid(layer.internalDiameter),
      }));
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
      minZoom: 5,
    }) as maplibregl.Map;
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", function () {
      addSources(map.current, clusterLayers);
      addLayers(map.current, zoomLevelRestrictions);
    });
  });

  useEffect(() => {
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
      });
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

const addSources: (map: maplibregl.Map, sources: LayerMetadata[]) => void = (
  map,
  sources
) => {
  sources.forEach(({ id, table }) => {
    map.addSource(table, {
      type: "vector",
      tiles: [`http://139.geosemantica.ru:15121/${id}/{z}/{x}/{y}.pbf`],
    });
  });
};

const addLayers: (
  map: maplibregl.Map,
  sources: (LayerMetadata & LayerZoomRestrictions)[]
) => void = (map, sources) => {
  sources.forEach(({ id, table, minZoom, maxZoom }) => {
    map.addLayer({
      minzoom: minZoom,
      maxzoom: maxZoom,
      id,
      type: "circle",
      source: table,
      "source-layer": id,
      paint: clusterStyleConfig,
    });
    map.addLayer({
      minzoom: minZoom,
      maxzoom: maxZoom,
      id: id + "__1",
      type: "line",
      source: table,
      "source-layer": id,
      paint: {
        "line-color": "#999999",
        "line-width": 2,
      },
    });
  });
};

export default Map;
