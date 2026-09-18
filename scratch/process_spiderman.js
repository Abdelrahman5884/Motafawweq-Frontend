import sharp from 'sharp';
import path from 'path';

const inputPath = 'C:\\Users\\NV\\.gemini\\antigravity-ide\\brain\\7de1cdf8-4d36-40a4-99f0-3ccf11fdb7c4\\spider_hero_hanging_1789690604383.jpg';
const outputPath = path.resolve('public/characters/spiderman-realistic.png');

async function processClean() {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBg = new Uint8Array(width * height);
  const queue = [];

  function trySeed(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (isBg[idx] !== 0) return;
    const srcIdx = idx * channels;
    const r = data[srcIdx], g = data[srcIdx + 1], b = data[srcIdx + 2];
    // Background pixel has low brightness
    if (r < 30 && g < 30 && b < 30) {
      isBg[idx] = 1;
      queue.push(x, y);
    }
  }

  // Seed borders
  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  // Seed inner region between thighs/calves (x around 480..544, y around 240..340)
  for (let y = 200; y < 360; y += 4) {
    for (let x = 460; x < 564; x += 4) {
      trySeed(x, y);
    }
  }

  // Flood fill
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];
    for (let i = 0; i < 4; i++) {
      const [nx, ny] = neighbors[i];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (isBg[nidx] === 0) {
          const srcIdx = nidx * channels;
          const r = data[srcIdx], g = data[srcIdx + 1], b = data[srcIdx + 2];
          if (r < 32 && g < 32 && b < 32) {
            isBg[nidx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  let minX = width, maxX = 0, minY = height, maxY = 0;
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const outIdx = idx * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      rgba[outIdx] = r;
      rgba[outIdx + 1] = g;
      rgba[outIdx + 2] = b;

      if (isBg[idx] === 1) {
        rgba[outIdx + 3] = 0;
      } else {
        rgba[outIdx + 3] = 255;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const padding = 6;
  const cropLeft = Math.max(0, minX - padding);
  const cropTop = 0; // Keep top from web source
  const cropWidth = Math.min(width - cropLeft, (maxX - minX) + padding * 2);
  const cropHeight = Math.min(height - cropTop, (maxY - cropTop) + padding);

  const png = sharp(rgba, {
    raw: { width, height, channels: 4 }
  });

  await png
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log('Spiderman cropped & clean saved successfully!');
}

processClean().catch(console.error);
