import { useMemo} from "react";
import { ISprite } from "../../domain/ISprite";
import { SpriteDecorator } from "../../domain/SpriteDecorator";
import useFetchSprite from "./use-fetch-sprite";

export interface ConfigProps {
    nameFrameAdded : string;
    fileName: string;
}
export const useAddDecorator = ({baseSprite, config}: {baseSprite: ISprite | null, config: ConfigProps}) => {
    const { sprite : newObjectSprite, loading } = useFetchSprite( config.fileName );
    const spriteDecorated = useMemo(() =>{
        if(!baseSprite || !newObjectSprite) return null;
        return new SpriteDecorator(
            baseSprite,
            config.nameFrameAdded,
            newObjectSprite.getWidth(),
            newObjectSprite.getHeight(),
            newObjectSprite.getFramesCount(),
            newObjectSprite.getFramesData()
        )
    }, [baseSprite, newObjectSprite, config.nameFrameAdded])

    return { spriteDecorated , loading };

}