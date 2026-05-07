import { readdir } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const framesDir = path.join(process.cwd(), "public", "image_frames");
    const files = await readdir(framesDir);

    const frames = files
      .filter((file) => /^ezgif-frame-\d{3}\.jpg$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/image_frames/${file}`);

    return Response.json({ frames });
  } catch {
    return Response.json({ frames: [] }, { status: 200 });
  }
}
