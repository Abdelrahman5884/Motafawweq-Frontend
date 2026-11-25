// ISO/IEC 15417 Standard Code-128 bar/space module width patterns (indices 0..106)
const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312',
  '132212', '221213', '221312', '231212', '112232', '122132', '122231', '113222',
  '123122', '123221', '223211', '221132', '221231', '213212', '223112', '312131',
  '311222', '321122', '321221', '312212', '322112', '322211', '212123', '212321',
  '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121',
  '313121', '211331', '231131', '213113', '213311', '213131', '311123', '311321',
  '331121', '312113', '312311', '332111', '314111', '221411', '431111', '111224',
  '111422', '121124', '121421', '141122', '141221', '112214', '112412', '122114',
  '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112',
  '421211', '212141', '214121', '412121', '111143', '111341', '131141', '114113',
  '114311', '411113', '411311', '113141', '114131', '311141', '411131', '211412',
  '211214', '211232', '2331112'
];

/**
 * Encode printable ASCII text into ISO Code-128B bars (x, width) in module units.
 * @param {string} rawText
 * @returns {{ bars: Array<{ x: number, w: number }>, totalWidth: number, sanitized: string }}
 */
export function encodeCode128B(rawText) {
  const sanitized = String(rawText || '')
    .trim()
    .replace(/[^\x20-\x7E]/g, '') || 'STD-0000';

  const startCodeB = 104;
  const stopCode = 106;
  const codes = [startCodeB];

  let checksum = startCodeB;
  for (let i = 0; i < sanitized.length; i++) {
    const val = sanitized.charCodeAt(i) - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }
  codes.push(checksum % 103);
  codes.push(stopCode);

  const quietZone = 10;
  let cursor = quietZone;
  const bars = [];

  for (const code of codes) {
    const pattern = CODE128_PATTERNS[code];
    if (!pattern) continue;
    for (let j = 0; j < pattern.length; j++) {
      const width = Number(pattern[j]);
      if (j % 2 === 0) {
        bars.push({ x: cursor, w: width });
      }
      cursor += width;
    }
  }

  return {
    bars,
    totalWidth: cursor + quietZone,
    sanitized,
  };
}

/**
 * Generate a crisp standalone SVG string of a Code-128B barcode (ideal for high-DPI print templates).
 */
export function generateCode128SvgString(
  value,
  { height = 44, barColor = '#06254E', background = '#FFFFFF' } = {}
) {
  const { bars, totalWidth } = encodeCode128B(value);
  const rects = bars
    .map((b) => `<rect x="${b.x}" y="0" width="${b.w}" height="${height}" fill="${barColor}" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height}" width="100%" height="${height}" preserveAspectRatio="none" style="display:block;background:${background};shape-rendering:crispEdges;">${rects}</svg>`;
}
