export default function formatFileSize(size: number, unit: 'B' | 'KB' | 'MB' | 'GB' | 'TB'): string {
  const unitMultipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const bytes = size * unitMultipliers[unit];

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let displaySize = bytes;

  while (displaySize >= 1024 && i < units.length - 1) {
    displaySize /= 1024;
    i++;
  }

  return `${displaySize.toFixed(2)} ${units[i]}`;
}
