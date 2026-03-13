'use client';
import styles from "./page.module.css";
import Billboard from "../modules/animation/presentation/components/Billboard";
import Input from "../modules/animation/presentation/components/Input";
import Movies from "../modules/animation/presentation/components/Movies";
import { useState } from "react";
import SellerCheckIn from "../modules/animation/presentation/components/Molecules/SellerCheckIn";

export default function Home() {
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.movies}>
        {title === null ? null : <Movies title={title} actionLoading={setLoading} />}
      </div>
      <SellerCheckIn loading={loading} />
      <div className={styles.billboard}>
        <Billboard />
      </div>
      <div className={styles.input}>
        <Input action={setTitle} actionLoading={setLoading} />
      </div>
    </div>
  );
}
