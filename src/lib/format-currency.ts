export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    const formatted = (value / 1_000_000_000_000).toFixed(1);
    const cleaned = formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted;
    return `$${cleaned}T`;
  } else if (absValue >= 1_000_000_000) {
    const formatted = (value / 1_000_000_000).toFixed(1);
    const cleaned = formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted;
    return `$${cleaned}B`;
  } else if (absValue >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(1);
    const cleaned = formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted;
    return `$${cleaned}M`;
  } else if (absValue >= 1_000) {
    const formatted = (value / 1_000).toFixed(0);
    return `$${formatted}k`;
  }

  return `$${value}`;
}
