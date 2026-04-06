function escapeCell(value) {
  const s = String(value ?? '')
  return `"${s.replace(/"/g, '""')}"`
}

/**
 * @param {Array<Record<string, unknown>>} rows
 * @param {string[]} columns — keys in order
 * @param {string} filename
 */
export function exportRowsAsCsv(rows, columns, filename = 'export.csv') {
  const header = columns.map(escapeCell).join(',')
  const lines = rows.map((row) =>
    columns.map((key) => escapeCell(row[key])).join(','),
  )
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
