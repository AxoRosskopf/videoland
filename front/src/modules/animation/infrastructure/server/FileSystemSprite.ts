import fs from 'fs';
import path from 'path';
import { 
    get_width, 
    get_height, 
    get_frames_count, 
    get_frames
 } from './ParserData';

/** 
 * @param dir Input a .c file exported from Piskel
 * @returns A JSON object containing width, height, frame count, and frame data URLs
**/

export function process_sprite(dir: string){
    try {
        const data = fs.readFileSync(dir, 'utf8');
        const baseName = path.basename(dir, '.c');

        return {
            "WIDTH": get_width(data, baseName.toUpperCase()),
            "HEIGHT": get_height(data, baseName.toUpperCase()),
            "FRAMES_COUNT": get_frames_count(data, baseName.toUpperCase()),
            "FRAMES_DATA": get_frames(data, baseName.toLowerCase()),
        };

    } catch (err) {
        console.error(err);
        return undefined;
    }
}