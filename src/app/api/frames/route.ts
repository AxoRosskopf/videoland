import { process_sprite } from "@/modules/animation/infrastructure/server/FileSystemSprite";
import { NextResponse } from "next/server";

import path from "path";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const spriteName = searchParams.get('file');
    if (!spriteName) {
        return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), `/public/frames/${spriteName}.c`);
    try{
         const spriteData = process_sprite(filePath);
         return NextResponse.json(spriteData);
    } catch (error) {
        console.error("Error processing frame data:", error);
        return NextResponse.json({ error: "Error processing frame data" }, { status: 500 });
    }
}