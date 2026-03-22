/** Extract dominant colors from an image URL using canvas.
 *  Returns an array of hex strings, most-dominant first.
 *  Falls back gracefully if CORS blocks the image.
 */
export async function extractColors(imageUrl: string, count = 4): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 80; // Downsample for speed
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve([]); return; }

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Bucket colors into 32x32x32 cube to find dominant hues
        const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue; // Skip transparent pixels
          // Skip near-white and near-black (they dominate most logos but aren't useful brand colors)
          const brightness = (r + g + b) / 3;
          if (brightness > 240 || brightness < 15) continue;

          // Quantize to reduce noise
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;
          if (!buckets[key]) buckets[key] = { r: qr, g: qg, b: qb, count: 0 };
          buckets[key].count++;
        }

        const sorted = Object.values(buckets)
          .sort((a, b) => b.count - a.count)
          .slice(0, count);

        const hexColors = sorted.map(({ r, g, b }) =>
          "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
        );

        resolve(hexColors);
      } catch {
        resolve([]);
      }
    };

    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}

/** Decide whether a hex color is dark (so we can choose white/black contrast text) */
export function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // W3C luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
