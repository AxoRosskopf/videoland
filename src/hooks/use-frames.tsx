"use client";
import { FrameData } from "../utils_server/frame_processing";
import { useEffect, useState } from "react";

function renderToSVG(data: string, width: number, height: number){
    if (typeof window === 'undefined') return '';
  
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const binaryString = window.atob(data);
    const bytes = new Uint8ClampedArray(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(bytes);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
}


const useFrames = (FileName : string) =>{
    const [frames, setFrames] = useState<FrameData | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
    fetch(`/api/frames?file=${FileName}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        setFrames({
            WIDTH: data.WIDTH,
            HEIGHT: data.HEIGHT,
            FRAMES_COUNT: data.FRAMES_COUNT,
            FRAMES_DATA: data.FRAMES_DATA.map((frameBase64: string) => renderToSVG(frameBase64, data.WIDTH, data.HEIGHT))   
        })
      })
      .catch(err => console.error("Error :", err))
      .finally(() => setLoading(false));
  }, [FileName]);

  return { frames, loading };
}

export default useFrames;