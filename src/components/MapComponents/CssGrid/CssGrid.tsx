import { FunctionComponent } from "react";
import styles from "./Grid.module.css";

const CssGrid: FunctionComponent = () => {
  const gridSells = new Array(100).fill(undefined);
  return (
    <div className={styles.main}>
      {gridSells.map((index) => (
        <div className={styles.div} key={index}></div>
      ))}
    </div>
  );
};

export default CssGrid;
