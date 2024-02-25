import styles from "./page.module.css";
import Cards from "./components/Cards";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.gradient}>
        <Cards />
      </div>
    </main>
  );
}
