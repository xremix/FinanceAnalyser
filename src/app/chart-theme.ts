export const chartColors = {
  income: '#3f9a76',
  expense: '#c8676b',
  text: '#64736f',
  grid: '#e7ede9',
  categories: ['#315b52', '#5b8f7f', '#8db3a3', '#c79a5b', '#b56f60', '#7c86a8', '#a77b9f', '#6aa0b5', '#9aa36b', '#c4b39a'],
};

export const chartFontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const compactCurrencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value ?? 0);
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value ?? 0);
}
