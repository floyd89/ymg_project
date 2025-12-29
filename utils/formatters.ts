
export const formatCurrency = (price: string | undefined | null): string => {
  if (!price) {
    return '';
  }
  // Trim whitespace dan periksa apakah awalan 'Rp' sudah ada (case-insensitive)
  const trimmedPrice = price.trim();
  if (trimmedPrice.toLowerCase().startsWith('rp')) {
    return trimmedPrice;
  }
  return `Rp ${trimmedPrice}`;
};
