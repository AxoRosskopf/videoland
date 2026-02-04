import { useEffect, useRef } from "react"
import { FrameData } from "../utils_server/frame_processing";
import { FramesCollection } from "./use-frames";

// TODO : Optimize for RAM memory 
const useAnimation = ( data : FramesCollection | undefined) => {
    const tarantinoRef = useRef<HTMLDivElement>(null);
    useEffect(() =>{
        if (data == undefined || !tarantinoRef.current) return;
        if (!data.PASIVE.FRAMES_DATA || data.PASIVE.FRAMES_DATA.length === 0 || !tarantinoRef.current) {
            return;
        }
        const aux = tarantinoRef.current;
        aux.style.width = `${data.PASIVE.WIDTH}px`;
        aux.style.height = `${data.PASIVE.HEIGHT}px`;
        let numFrame = 0;
        const id = setInterval(() => {
            aux.style.setProperty('--tarantino', `url(${data.PASIVE.FRAMES_DATA[numFrame]})`);
            aux.style.setProperty('--tarantino-hover', `url(${data.HOVER.FRAMES_DATA[numFrame]})`);
            numFrame = (numFrame + 1) % data.PASIVE.FRAMES_DATA.length;
        },300)
        return () => clearInterval(id);

    },[data])
    return tarantinoRef;
}
export default useAnimation;