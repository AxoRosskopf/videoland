import { useEffect, useRef } from "react"
import { FrameData } from "../utils_server/frame_processing";
// TODO : Optimize for RAM memory 
const useAnimation = ( data : FrameData) => {
    const tarantinoRef = useRef<HTMLDivElement>(null);
    useEffect(() =>{
        if (!data.FRAMES_DATA || data.FRAMES_DATA.length === 0 || !tarantinoRef.current) {
            return;
        }
        const aux = tarantinoRef.current;
        aux.style.width = `${data.WIDTH}px`;
        aux.style.height = `${data.HEIGHT}px`;
        let numFrame = 0;
        const id = setInterval(() => {
            aux.style.setProperty('--tarantino', `url(${data.FRAMES_DATA[numFrame]})`);
            numFrame = (numFrame + 1) % data.FRAMES_DATA.length;
        },300)
        return () => clearInterval(id);
    },[data])
    return tarantinoRef;
}
export default useAnimation;