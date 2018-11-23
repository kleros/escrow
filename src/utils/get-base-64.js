export default file => {
  return new Promise(resolve => {
    let request = new XMLHttpRequest()
    request.open('GET', file, true)
    request.responseType = 'blob'
    request.onload = () => {
      let reader = new FileReader()
      reader.readAsDataURL(request.response)
      reader.onload = e => resolve(_arrayBufferToBase64(e.target.result))
    }
    request.send()
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