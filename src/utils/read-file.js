export default file => {
  return new Promise(resolve => {
    let request = new XMLHttpRequest()
    request.open('GET', file, true)
    request.responseType = 'blob'
    request.onload = () => {
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log(reader.result)
        resolve(new Buffer(reader.result))
      }
      console.log(request.response)
      reader.readAsArrayBuffer(request.response)
    }
    request.send()
  })
}
