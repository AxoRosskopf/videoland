import { NextResponse } from "next/server";
import { process_frame } from "../../../utils_server/frame_processing";
import path from "path";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const frameName = searchParams.get('file');
    if (!frameName) {
        return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }
    console.log(`Fetching frame data for file: ${frameName}`);
    const filePath = path.join(process.cwd(), `/public/frames/${frameName}.c`);
    try{
         const frameData = process_frame(filePath);
         return NextResponse.json(frameData);
    } catch (error) {
        console.error("Error processing frame data:", error);
        return NextResponse.json({ error: "Error processing frame data" }, { status: 500 });
    }
}