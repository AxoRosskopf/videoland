'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import useFrames from "@/hooks/use-frames";
import useAnimation from "@/hooks/use-animation";


export default function Home() {
  const [hover, setHover] = useState(true);
  const { frames : sellerFrames } = useFrames('Seller', hover);
  const { frames : checkinFrames } = useFrames('CheckIn');
  const tarantinoRef = useAnimation(sellerFrames)
  return (
    <div className={styles.page}>
      <span ref={tarantinoRef} className={styles.tarantino} />
      <span 
        style={{
          backgroundImage: `url(${checkinFrames?.PASIVE.FRAMES_DATA[0]})`,
          width: `${checkinFrames?.PASIVE.WIDTH}px`,
          height: `${checkinFrames?.PASIVE.HEIGHT}px`
        }} 
        className={styles.frame}
      />
    </div>
  );
}
