'use client';
import Seller from "@@/components/Seller";
import styles from "./page.module.css";
import CheckIn from "@@/components/CheckIn";



export default function Home() {
  return (
    <div className={styles.page}>
      <Seller />
      <CheckIn />
    </div>
  );
}
