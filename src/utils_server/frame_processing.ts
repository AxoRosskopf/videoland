import fs from "fs";
import path from "path";

export type FrameData = {
    WIDTH: number,
    HEIGHT: number,
    FRAMES_COUNT: number,
    FRAMES_DATA: string[],
}



/** 
 * @param dir Input a .c file exported from Piskel
 * @returns A FrameData object containing width, height, frame count, and frame data URLs
**/

export function process_frame(dir: string): FrameData | undefined {
    try {
        const data = fs.readFileSync(dir, 'utf8');
        const baseName = path.basename(dir, '.c');

        return {
            WIDTH: get_width(data, baseName.toUpperCase()),
            HEIGHT: get_height(data, baseName.toUpperCase()),
            FRAMES_COUNT: get_frames_count(data, baseName.toUpperCase()),
            FRAMES_DATA: get_frames(data, baseName.toLowerCase()),
        };

    } catch (err) {
        console.error(err);
        return undefined;
    }
}

const get_width = (data: string, name: string): number => {
    const width_match = data.match(new RegExp(`#define ${name}_FRAME_WIDTH (\\d+)`));
    if (width_match) {
        return parseInt(width_match[1], 10);
    }
    throw new Error("Width not found in the .c file.");
}

const get_height = (data: string, name: string): number => {
    const height_match = data.match(new RegExp(`#define ${name}_FRAME_HEIGHT (\\d+)`));
    if (height_match) {
        return parseInt(height_match[1], 10);
    }
    throw new Error("Height not found in the .c file.");
}

const get_frames_count = (data: string, name: string): number => {
    const frames_match = data.match(new RegExp(`#define ${name}_FRAME_COUNT (\\d+)`));
    if (frames_match) {
        return parseInt(frames_match[1], 10);
    }
    throw new Error("Frames not found in the .c file.");
}

const get_frames = (data:string, name: string): string[] => {
    const frames_data_match = data.match(new RegExp(`static const uint32_t ${name}_data\\[(\\d+)\\]\\[(\\d+)\\] = \\{([\\s\\S]*?)\\};`, 'm'));
    if (frames_data_match) {
        const framesCount = parseInt(frames_data_match[1], 10);
        const pixelsPerFrame = parseInt(frames_data_match[2], 10);
        const framesDataRaw = frames_data_match[3].trim();

        const frameRegex = new RegExp(`\\{([\\s\\S]*?)\\}`, 'g');
        const frames: string[] = [];
        let match;
        while ((match = frameRegex.exec(framesDataRaw)) !== null) {
            const pixelValues = match[1].trim().split(',').map(val => val.trim());
            const byteArray = new Uint8ClampedArray(pixelsPerFrame * 4);
            for (let i = 0; i < pixelsPerFrame; i++) {
                const hexValue = pixelValues[i];
                const rgba = parseHexToRGBA(hexValue);
                byteArray[i * 4] = rgba.r;
                byteArray[i * 4 + 1] = rgba.g;
                byteArray[i * 4 + 2] = rgba.b;
                byteArray[i * 4 + 3] = rgba.a;
            }
            const buffer = Buffer.from(byteArray);
            const base64String = buffer.toString('base64');
            frames.push(base64String);
        }
        return frames;
    }
    throw new Error("Frames data not found in the .c file.");
}

const parseHexToRGBA = (hex: string) => {
    const num = parseInt(hex.replace('0x', ''), 16);
    // I assume that the num in hex has this format : 0xAABBGGRR
    return{
        r: num & 0xFF, 
        g: (num >> 8) & 0xFF,
        b: (num >> 16) & 0xFF,
        a: (num >> 24) & 0xFF, // All data has FF alpha, but just in case
    }
}
