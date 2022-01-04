import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";

const Map: FunctionComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null as any);
  const [lng] = useState(30.32);
  const [lat] = useState(59.94);
  const [zoom] = useState(5);
  const [API_KEY] = useState("get_your_own_OpIi9ZULNHzrESv6T2vL");

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
    map.current.on("zoomend", () => {
      console.log("zoom");
    });
  });

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
};

export default Map;
