import { useEffect, useRef, useState } from "react";
import { ISprite } from "../../domain/ISprite";

export interface Animation {
    sprite: ISprite | null;
    interval: number;
    cssVar: string;
}

/** 
 * @param {Record<string, Animation>} animationCollection - A collection of animations with their configurations
 * @param {string} key - The key identifying the specific animation to be used
 * @param {Animation} Animation - Each animation configuration should include:
 *   - sprite: An object implementing the ISprite interface, containing frame data and dimensions
 *   - interval: The time in milliseconds between frame changes
 *   - cssVar: The name of the CSS variable to update with the current frame's URL
 * @returns A ref to be attached to a DOM element that will display the animation
 * **/

const useAnimationController = ( animationCollection : Record<string, Animation>, key: string = "idle") =>{
    const  objectRef = useRef<HTMLDivElement>(null);
    const [ actual, setActual] = useState<string>(key)
    useEffect(()=>{
        const picked = animationCollection[actual]; 
        if(!objectRef.current || !picked || !picked.sprite) return;
        let frameIndex = 0;
        const totalFrames = picked.sprite.getFramesCount();
        objectRef.current.style.width = `${picked.sprite.getWidth()}px`;
        objectRef.current.style.height = `${picked.sprite.getHeight()}px`;
        const intervalId = setInterval(() => {
            const frameData = picked.sprite?.getFramesData()[frameIndex];
            objectRef.current?.style.setProperty(picked.cssVar, `url(${frameData})`);

            frameIndex = (frameIndex + 1) % totalFrames;
        }, picked.interval);

        return () => {
            clearInterval(intervalId);
        };

    }, [animationCollection, actual])

    return {
        objectRef,
        setAnimation: setActual
    };
}
export default useAnimationController;