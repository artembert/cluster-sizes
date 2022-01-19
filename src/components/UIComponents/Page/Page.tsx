import { FunctionComponent } from "react";
import { SellSizeProvider } from "../../../contexts/CellSizeContext";
import { GridSellSizeProvider } from "../../../contexts/GridCellSizeContext";
import CanvasGrid from "../../MapComponents/CanvasGrid/CanvasGrid";
import Map from "../../MapComponents/Map/Map";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Page.module.css";

export const Page: FunctionComponent = () => {
  return (
    <SellSizeProvider>
      <GridSellSizeProvider>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Cluster sizes</h1>
          </header>
          <aside className={styles.sidebar}>
            <Sidebar />
          </aside>
          <main className={styles.main}>
            <Map />
            {/*<div className={styles.gridContainer}>*/}
            {/*  <CanvasGrid width={650} height={650} />*/}
            {/*</div>*/}
          </main>
        </div>
      </GridSellSizeProvider>
    </SellSizeProvider>
  );
};
