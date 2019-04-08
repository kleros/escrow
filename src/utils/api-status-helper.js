/**
 * Checkes status.
 * @param {object} response - The http response.
 * @returns {object} - The response.
 */
export default function statusHelper(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}
