export async function GET() {
  const TOTAL_FRAMES = 240;
  const frames = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
    const frameNumber = String(index + 1).padStart(3, "0");
    return `/image_frames/ezgif-frame-${frameNumber}.jpg`;
  });

  return Response.json({ frames });
}
