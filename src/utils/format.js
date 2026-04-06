export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatShortDate(isoDate) {
  if (!isoDate) return '—'
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function monthKey(isoDate) {
  return isoDate.slice(0, 7)
}
