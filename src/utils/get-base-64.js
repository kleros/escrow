export const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => resolve(_arrayBufferToBase64(reader.result))
      reader.onerror = error => reject(error)
    })
  }
  
const _arrayBufferToBase64 = buffer => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength

  for (let i = 0; i < len; i++)
    binary += String.fromCharCode(bytes[i])

  return binary
}