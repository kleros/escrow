const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export const displayDateUTC = (dateString) => {
  const _date = new Date(dateString)

  const date = String(_date.getUTCDate()).replace(/\b(\d{1})\b/g, '0$1')
  const month = _date.getUTCMonth()
  const year = _date.getUTCFullYear()
  const hours = String(_date.getUTCHours()).replace(/\b(\d{1})\b/g, '0$1')
  const minutes = String(_date.getUTCMinutes()).replace(/\b(\d{1})\b/g, '0$1')

  return `${months[month]} ${date} ${year} ${hours}:${minutes} UTC`
}
