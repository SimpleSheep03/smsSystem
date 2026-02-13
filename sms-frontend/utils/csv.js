/**
 * Convert array of objects to CSV and trigger download
 * @param {Array} data - Array of objects to convert to CSV
 * @param {string} filename - Name of the file to download
 * @param {Array} columns - Column names to include (optional, defaults to all keys)
 */
export const exportToCSV = (data, filename = 'export.csv', columns = null) => {
  if (!data || data.length === 0) {
    return
  }

  // Determine columns
  const cols = columns || Object.keys(data[0])
  
  // Create CSV header
  const header = cols.map(col => `"${col}"`).join(',')
  
  // Create CSV rows
  const rows = data.map(obj =>
    cols.map(col => {
      const value = obj[col]
      if (value === null || value === undefined) {
        return '""'
      }
      // Escape quotes and wrap in quotes
      const escaped = String(value).replace(/"/g, '""')
      return `"${escaped}"`
    }).join(',')
  )
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n')
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export messages to CSV
 * @param {Array} messages - Array of message objects
 */
export const exportMessagesToCSV = (messages, phone) => {
  const data = messages.map(msg => ({
    'Phone': msg.phoneNumber,
    'Message': msg.message,
    'Status': msg.status,
    'Date': new Date(msg.timestamp).toLocaleString()
  }))
  
  const filename = `messages_${phone}_${new Date().getTime()}.csv`
  exportToCSV(data, filename)
}

/**
 * Export blocked numbers to CSV
 * @param {Array} blockedNumbers - Array of blocked phone numbers
 */
export const exportBlockedToCSV = (blockedNumbers) => {
  const data = blockedNumbers.map(phone => ({
    'Phone Number': phone
  }))
  
  const filename = `blocked_numbers_${new Date().getTime()}.csv`
  exportToCSV(data, filename)
}
