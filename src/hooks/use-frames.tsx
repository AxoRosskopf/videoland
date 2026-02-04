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

export type FramesCollection = {
    PASIVE : FrameData,
    HOVER : FrameData
}

const useFrames = (FileName : string, hover: boolean = false) =>{
    const [frames, setFrames] = useState<FramesCollection | undefined>(undefined);
    useEffect(() => {
        Promise.all([
            fetch(`/api/frames?file=${FileName}`).then(res => res.json()),  
            hover ? fetch(`/api/frames?file=${FileName}Hover`).then(res => res.json()) 
            : Promise.resolve(null)  
        ])
        .then(([passiveData, hoverData]) => {
            setFrames({
                PASIVE: {
                    WIDTH: passiveData.WIDTH,
                    HEIGHT: passiveData.HEIGHT,
                    FRAMES_COUNT: passiveData.FRAMES_COUNT,
                    FRAMES_DATA: passiveData.FRAMES_DATA.map((f: string) => renderToSVG(f, passiveData.WIDTH, passiveData.HEIGHT))
                },
                HOVER: hoverData ? {
                    WIDTH: hoverData.WIDTH,
                    HEIGHT: hoverData.HEIGHT,
                    FRAMES_COUNT: hoverData.FRAMES_COUNT,
                    FRAMES_DATA: hoverData.FRAMES_DATA.map((f: string) => renderToSVG(f, hoverData.WIDTH, hoverData.HEIGHT))
                } : {
                    WIDTH: 0,
                    HEIGHT: 0,
                    FRAMES_COUNT: 0,
                    FRAMES_DATA: []
                }
            });
        })
        .catch(err => {
            console.error("Error loading frames:", err);
            setFrames(undefined);
        })
    }, [FileName]);

    return { frames };
}

export default useFrames;