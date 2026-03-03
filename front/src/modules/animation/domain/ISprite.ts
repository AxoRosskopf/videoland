export interface ISprite {
    getWidth(): number;
    getHeight(): number;
    getFramesCount(): number;
    getFramesData(): string[];
}