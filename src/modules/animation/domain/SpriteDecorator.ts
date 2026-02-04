import { ISprite } from "./ISprite";

export class SpriteDecorator implements ISprite {
    private _baseSprite: ISprite;
    private _width: number;
    private _height: number;
    private _framesCount: number;
    private _frameData: string[];
    private _nameFrame: string;
    
    constructor(
        baseSprite: ISprite,
        nameFrame: string,
        width?: number,
        height?: number,
        framesCount?: number,
        frameData?: string[]
    ) {
        this._baseSprite = baseSprite;
        this._nameFrame = nameFrame;
        this._width = width ?? baseSprite.getWidth();
        this._height = height ?? baseSprite.getHeight();
        this._framesCount = framesCount ?? baseSprite.getFramesCount();
        this._frameData = frameData ?? baseSprite.getFramesData();
    }

    getBaseSpriteWidth(): number {
        return this._baseSprite.getWidth();
    }
    getBaseSpriteHeight(): number {
        return this._baseSprite.getHeight();
    }
    getBaseSpriteFramesCount(): number {
        return this._baseSprite.getFramesCount();
    }
    getBaseSpriteFramesData(): string[] {
        return this._baseSprite.getFramesData();
    }

    getNameFrame(): string {
        return this._nameFrame;
    }
    getWidth(): number {
        return this._width;
    }
    getHeight(): number {
        return this._height;
    }
    getFramesCount(): number {
        return this._framesCount;
    }
    getFramesData(): string[] {
        return this._frameData;
    }
}