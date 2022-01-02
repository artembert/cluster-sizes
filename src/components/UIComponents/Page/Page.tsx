import { FunctionComponent } from "react";
import { GridSellSizeProvider } from "../../../contexts/GridCellSizeContext";
import CanvasGrid from "../../MapComponents/CanvasGrid/CanvasGrid";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Page.module.css";

export const Page: FunctionComponent = () => {
  return (
    <GridSellSizeProvider>
      <div className={styles.container}>
        <header className={styles.header}></header>
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
        <main className={styles.main}>
          <CanvasGrid width={800} height={500} />
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </GridSellSizeProvider>
  );
};
