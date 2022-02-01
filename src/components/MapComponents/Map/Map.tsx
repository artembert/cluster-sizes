import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FunctionComponent, useEffect, useRef } from "react";
import {
  MIN_MARKER_DIAMETER,
  useCellSize,
} from "../../../contexts/CellSizeContext";
import {
  INITIAL_LATITUDE,
  INITIAL_LON,
  INITIAL_ZOOM_LEVEL,
  useGridSellSizeDispatch,
} from "../../../contexts/GridCellSizeContext";
import { ActionKind } from "../../../contexts/models/action-kind.constant";
import styles from "./Map.module.css";
import { clusterLayers, LayerMetadata } from "../../../data/layers";
import { clusterStyleConfig } from "./marker-config";
import {
  getZoomLevelsForLayers,
  LayerZoomRestrictions,
} from "../../../geo-helpers/get-zoom-levels-for-layers.helper";
import { CanvasPoint } from "../CanvasPoint/CanvasPoint";

export interface ClusterFeature {
  geometry: { type: "Point"; coordinates: [number, number] };
  source: string;
  sourceLayer: string;
  properties: { id: number; num: string };
}

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
    const zoomLevelsForLayers = getZoomLevelsForLayers(
      clusterLayers.map((layer) => layer.internalDiameter)
    );
    console.log(zoomLevelsForLayers);
    const zoomLevelRestrictions: (LayerMetadata & LayerZoomRestrictions)[] =
      clusterLayers.map((layer) => ({
        ...layer,
        ...zoomLevelsForLayers[layer.internalDiameter],
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
      map.current.on("sourcedata", (e) => {
        if (!e.sourceId?.includes("stat_grid_") || !e.isSourceLoaded) {
          return;
        }
        console.log("on sourcedata", e);
        addMarkers(
          map.current,
          clusterLayers.map((item) => item.id)
        );
      });
      // @ts-ignore
      window["map"] = map.current;
    });
  });

  useEffect(() => {
    map.current.on("zoomstart", () => {
      handleZoomChange({
        zoomLevel: map.current.getZoom(),
        lat: map.current.getCenter().lat,
      });
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
const existingMarkers: Record<string, Marker> = {};

const addLayers: (
  map: maplibregl.Map,
  sources: (LayerMetadata & LayerZoomRestrictions)[]
) => void = (map, sources) => {
  sources.forEach(({ id, table, minZoom, maxZoom }) => {
    map.addLayer({
      minzoom: minZoom,
      maxzoom: maxZoom,
      id: id,
      type: "circle",
      source: table,
      "source-layer": id,
      paint: clusterStyleConfig,
    });
  });
};

const addMarkers: (
  map: maplibregl.Map,
  clustersLayersNames: string[]
) => void = (map, clustersLayersNames) => {
  const visibleFeatures = map.queryRenderedFeatures(undefined, {
    layers: clustersLayersNames,
  }) as any as ClusterFeature[];
  console.log("addMarkers:start", existingMarkers);
  console.log("addMarkers:start visibleFeatures", visibleFeatures);
  Object.entries(existingMarkers).forEach(([key, marker]) => {
    marker.remove();
    delete existingMarkers[key];
  });
  console.log("existingMarkers before render", existingMarkers);

  visibleFeatures.forEach(({ sourceLayer, geometry, properties }) => {
    if (geometry.type !== "Point") {
      return;
    }
    if (!properties.id || !properties.num) {
      return;
    }
    const marker = new maplibregl.Marker({
      element: CanvasPoint(MIN_MARKER_DIAMETER),
    });
    marker.setLngLat(geometry.coordinates).addTo(map);
    existingMarkers[getUniqueId(sourceLayer, properties)] = marker;
  });
  console.log("existingMarkers after render", existingMarkers);
};

function getUniqueId(
  sourceLayer: string,
  { id, num }: { id: number; num: string }
): string {
  return sourceLayer + id + "-" + num;
}

export default Map;
