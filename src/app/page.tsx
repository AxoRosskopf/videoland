'use client';
import Seller from "@/modules/animation/presentation/components/Seller";
import CheckIn from "@/modules/animation/presentation/components/CheckIn";
import styles from "./page.module.css";
import Billboard from "@/modules/animation/presentation/components/Billboard";
import Input from "@/modules/animation/presentation/components/Input";
import Movies from "@/modules/animation/presentation/components/Movies";
import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState<string | null>(null);
  return (
    <div className={styles.page}>
      <div className={styles.movies}>
        {title === null ? null : <Movies title={title} />}
      </div>
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
        <Input action={setTitle} />
      </div>
    </div>
  );
}
