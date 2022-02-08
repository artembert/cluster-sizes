import maplibregl, { Marker } from "maplibre-gl";
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
import {
  clusterSources,
  hexagonSources,
  SourceMetadata,
} from "../../../data/sources";
import { clusterStyleConfig } from "./marker-config";
import {
  ClusterSizesZoomLevelsDictionary,
  getZoomLevelsForLayers,
  LayerZoomRestrictions,
} from "../../../geo-helpers/get-zoom-levels-for-layers.helper";
import { CanvasPoint } from "../CanvasPoint/CanvasPoint";
import { filterClusterPoints } from "./helpers/filter-empty-clusters";
import { resolveClusterSizeInLayerRange } from "../../../geo-helpers/resolve-cluster-size-in-layer-range.helper";
import { ClusterFeature } from "./models/cluset-feature.interface";
import { filter, fromEvent, merge, take, throttle, timer } from "rxjs";
import { getVisibleLayerForGivenZoomLevel } from "../../../geo-helpers/get-visible-layer-for-given-zoom-level";
import { preparePieChartData } from "./helpers/prepare-pie-chart-data.helper";

const existingMarkers: Record<string, Marker> = {};

const Map: FunctionComponent = () => {
  const dispatch = useGridSellSizeDispatch();
  const cellSizes = useCellSize();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null as any);
  const lng = INITIAL_LON;
  const lat = INITIAL_LATITUDE;
  const zoom = INITIAL_ZOOM_LEVEL;
  const API_KEY = "WG5WfHW7QZ4Jd8QZ6hkg";

  const zoomLevelsForLayers: ClusterSizesZoomLevelsDictionary =
    getZoomLevelsForLayers(
      clusterSources.map((layer) => layer.internalDiameter)
    );
  const clusterLayers: (SourceMetadata & LayerZoomRestrictions)[] =
    clusterSources.map((layer) => ({
      ...layer,
      ...zoomLevelsForLayers[layer.internalDiameter],
    }));
  const hexagonLayers: (SourceMetadata & LayerZoomRestrictions)[] =
    hexagonSources.map((layer) => ({
      ...layer,
      ...zoomLevelsForLayers[layer.internalDiameter],
    }));

  function handleZoomEnd({
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

  function updateMarkers(): void {
    const visibleLayer = getVisibleLayerForGivenZoomLevel(
      zoomLevelsForLayers,
      clusterSources,
      map.current.getZoom()
    );
    if (visibleLayer) {
      addMarkers(
        map.current,
        clusterSources.map((item) => item.id),
        visibleLayer
      );
    }
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

    map.current.on("load", () => {
      addSources(map.current, clusterSources);
      addSources(map.current, hexagonSources);
      addClusterLayers(map.current, clusterLayers);
      addHexagonLayers(map.current, hexagonLayers);

      fromEvent(map.current, "sourcedata")
        .pipe(
          filter(
            (e) => !(!e.sourceId?.includes("stat_grid_") || !e.isSourceLoaded)
          ),
          take(1)
        )
        .subscribe(() => {
          updateMarkers();
        });
      // @ts-ignore
      window["map"] = map.current;
    });
  });

  useEffect(() => {
    const zoom$ = fromEvent(map.current, "zoom").pipe(
      throttle(() => timer(200))
    );
    const zoomEnd$ = fromEvent(map.current, "zoomend");

    merge(zoom$, zoomEnd$).subscribe(() => {
      updateMarkers();
    });
    map.current.on("zoomend", () => {
      handleZoomEnd({
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

const addSources: (map: maplibregl.Map, sources: SourceMetadata[]) => void = (
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

function addClusterLayers(
  map: maplibregl.Map,
  sources: (SourceMetadata & LayerZoomRestrictions)[]
): void {
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
}

function addHexagonLayers(
  map: maplibregl.Map,
  sources: (SourceMetadata & LayerZoomRestrictions)[]
): void {
  sources.forEach(({ id, table, minZoom, maxZoom }) => {
    map.addLayer({
      minzoom: minZoom,
      maxzoom: maxZoom,
      id: id,
      type: "line",
      source: table,
      "source-layer": id,
      paint: {
        "line-color": "transparent",
      },
    });
  });
}

const addMarkers: (
  map: maplibregl.Map,
  clustersLayersNames: string[],
  layer: SourceMetadata
) => void = (map, clustersLayersNames, layer) => {
  // const renderedFeatures = map.queryRenderedFeatures(undefined, {
  //   layers: clustersLayersNames,
  // }) as any as ClusterFeature[];
  // console.log(renderedFeatures);

  const visibleFeatures = map.querySourceFeatures(layer.table, {
    sourceLayer: layer.id,
  }) as any as ClusterFeature[];

  Object.entries(existingMarkers).forEach(([key, marker]) => {
    marker.remove();
    delete existingMarkers[key];
  });

  const visiblePoints = filterClusterPoints(visibleFeatures);
  const [minCount, maxCount] = [
    Math.min(...visiblePoints.map((item) => parseInt(item.properties.num, 10))),
    Math.max(...visiblePoints.map((item) => parseInt(item.properties.num, 10))),
  ];

  visiblePoints.forEach(({ geometry, properties }) => {
    const marker = new maplibregl.Marker({
      element: CanvasPoint(
        preparePieChartData(properties),
        resolveClusterSizeInLayerRange(
          parseInt(properties.num, 10),
          minCount,
          maxCount
        )
      ),
    });
    marker.setLngLat(geometry.coordinates).addTo(map);
    existingMarkers[getUniqueId(layer.id, properties)] = marker;
  });
};

function getUniqueId(
  sourceLayer: string,
  { id, num }: { id: number; num: string }
): string {
  return sourceLayer + id + "-" + num;
}

export default Map;
