import { useEffect, useState } from "react";
import { fetchSprite } from "../../infrastructure/client/ApiFrameService";
import { ISprite } from "../../domain/ISprite";

const useFetchSprite = (fileName : string) =>{
    const [sprite, setSprite] = useState<ISprite | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() =>{
        let mount = true;
        const loadSprite = async () => {
            try{
                const sprite = await fetchSprite(fileName);
                if (mount) {
                    setSprite(sprite);
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error fetching sprite:", error);
                if (mount) setLoading(false);
            }
        }
        loadSprite();
        return () => { mount = false; }
    },[fileName])
    return { sprite, loading};
}

export default useFetchSprite;