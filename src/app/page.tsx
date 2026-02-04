'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import useFrames from "@/hooks/use-frames";
import useAnimation from "@/hooks/use-animation";


export default function Home() {
const tarantinoRef = useRef<HTMLDivElement>(null);
  const { frames, loading } = useFrames('Seller');
  const tarantinoRefHook = useAnimation(frames || {
    WIDTH: 0,
    HEIGHT: 0,
    FRAMES_COUNT: 0,
    FRAMES_DATA: []
  });

  return (
    <div className={styles.page}>
      <span ref={tarantinoRefHook} className={styles.tarantino} />
    </div>
  );
}
