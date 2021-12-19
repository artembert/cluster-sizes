import React, { FunctionComponent } from "react";
import styles from "./Sidebar.module.css";

const Sidebar: FunctionComponent = () => {
  return (
    <div className={styles.layout}>
      <div>zoomLevel: 9</div>
      <div>cell-radius: 15px</div>
      <div>marker-radius: 15px;</div>
    </div>
  );
};

export default Sidebar;
