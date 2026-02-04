import { ISprite } from "./ISprite";

export class ObjectSprite implements ISprite {
    private _width: number;
    private _height: number;
    private _framesCount: number;
    private _framesData: string[];

    constructor(
        width: number,
        height: number,
        framesCount: number,
        framesData: string[]
    ) {
        this._width = width;
        this._height = height;
        this._framesCount = framesCount;
        this._framesData = framesData;
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
        return this._framesData;
    }

};