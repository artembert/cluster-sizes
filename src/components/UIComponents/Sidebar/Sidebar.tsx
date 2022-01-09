import { FunctionComponent } from "react";
import CellSizesPanel from "../CellSizesPanel/CellSizesPanel";
import MapMetadata from "../MapMetadata/MapMetadata";
import ProfilePlot from "../ProfilePlot/ProfilePlot";
import styles from "./Sidebar.module.css";

const Sidebar: FunctionComponent = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.disclaimer}>
        <div>
          <strong>Disclaimer</strong>
        </div>
        <div>
          <span>Clusters are randomly generated</span>
        </div>
      </div>
      <div className={styles.columns}>
        <MapMetadata />
        <CellSizesPanel />
      </div>
      <div className={styles.profilePlot}>
        <ProfilePlot width={340} height={300} />
      </div>
    </div>
  );
};

export default Sidebar;
