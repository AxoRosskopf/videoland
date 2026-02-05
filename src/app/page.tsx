'use client';
import Seller from "@@/components/Seller";
import CheckIn from "@@/components/CheckIn";
import styles from "./page.module.css";
import Billboard from "@/modules/animation/presentation/components/Billboard";
import Input from "@/modules/native/components/Input";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <Seller />
      </div>
      <div className={styles.front}>
        <CheckIn />
      </div>
      <div className={styles.billboard}>
        <Billboard />
      </div>
      <div className={styles.input}>
        <Input />
      </div>
    </div>
  );
}
