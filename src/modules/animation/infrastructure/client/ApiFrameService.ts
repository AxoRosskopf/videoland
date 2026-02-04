import { ISprite } from "../../domain/ISprite";
import { ObjectSprite } from "../../domain/ObjectSprite"

function renderToPNG(data: string, width: number, height: number){
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

export async function fetchSprite( fileName: string ): Promise<ISprite> {

    try{
        const res = await fetch(`/api/frames?file=${fileName}`)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return new ObjectSprite(
            data.WIDTH,
            data.HEIGHT,
            data.FRAMES_COUNT,
            data.FRAMES_DATA.map((frameData: string) => renderToPNG(frameData, data.WIDTH, data.HEIGHT))
        );

    } catch (error) {
        throw new Error("Failed to fetch frame data");
    }
}
