export interface PhotoPosition {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  rotation: number; // degrees
  zIndex: number; // stacking order
  scale: number; // size variation
}

const ROTATION_RANGE = 8;
const SCALE_MIN = 0.95;
const SCALE_MAX = 1.05;
const COLS = 4;

/**
 * Generates positions for photos.
 * - Small teams (1-4): clustered in center
 * - Larger teams: grid layout with 4 columns and slight randomness
 */
export function generatePositions(count: number): PhotoPosition[] {
  if (count === 0) return [];

  if (count <= 4) {
    return generateClusteredPositions(count);
  }

  return generateGridPositions(count);
}

/**
 * Clustered layout for small teams (1-4 photos)
 */
function generateClusteredPositions(count: number): PhotoPosition[] {
  const positions: PhotoPosition[] = [];
  const centerY = 50;

  const spacing = count === 1 ? 0 : 20; // percentage between photos
  const totalWidth = (count - 1) * spacing;
  const startX = 50 - totalWidth / 2;

  for (let i = 0; i < count; i++) {
    const baseX = startX + i * spacing;

    const jitterX = (Math.random() - 0.5) * 6;
    const jitterY = (Math.random() - 0.5) * 10;

    positions.push({
      x: baseX + jitterX,
      y: centerY + jitterY,
      rotation: (Math.random() - 0.5) * 2 * ROTATION_RANGE,
      scale: SCALE_MIN + Math.random() * (SCALE_MAX - SCALE_MIN),
      zIndex: Math.floor(Math.random() * count) + 1,
    });
  }

  return positions;
}

/**
 * Grid layout for larger teams (5+ photos)
 * 4 columns with slight randomness, incomplete rows centered
 */
function generateGridPositions(count: number): PhotoPosition[] {
  const positions: PhotoPosition[] = [];
  const rows = Math.ceil(count / COLS);

  const colWidth = 100 / (COLS + 1); // leave margins
  const rowHeight = 100 / (rows + 1);

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / COLS);
    const colInRow = i % COLS;

    const itemsInThisRow = row === rows - 1 ? count - row * COLS : COLS;

    const colOffset = (COLS - itemsInThisRow) / 2;
    const col = colInRow + colOffset;

    // Base grid position
    const baseX = colWidth * (col + 1);
    const baseY = rowHeight * (row + 1);

    const jitterX = (Math.random() - 0.5) * (colWidth * 0.4);
    const jitterY = (Math.random() - 0.5) * (rowHeight * 0.3);

    positions.push({
      x: Math.max(10, Math.min(90, baseX + jitterX)),
      y: Math.max(10, Math.min(90, baseY + jitterY)),
      rotation: (Math.random() - 0.5) * 2 * ROTATION_RANGE,
      scale: SCALE_MIN + Math.random() * (SCALE_MAX - SCALE_MIN),
      zIndex: Math.floor(Math.random() * count) + 1,
    });
  }

  return positions;
}

/**
 * Calculate the required height for the collage based on number of photos.
 * Returns height in pixels.
 */
export function getCollageHeight(count: number): number {
  if (count === 0) return 80;

  const photoHeight = 128; // md:h-32 = 128px

  if (count <= 4) return photoHeight + 50;

  const rows = Math.ceil(count / COLS);
  const rowSpacing = photoHeight * 1.1;

  return photoHeight + (rows - 1) * rowSpacing + 50;
}
