import { ipfs } from '../../bootstrap/dapp-api'

const ipfsPublish = async (fileName, data) => {
  const buffer = await Buffer.from(data)
  return new Promise(resolve => {
    ipfs.add(
      {
        path: `/${fileName}`,
        content: buffer
      },
      {
        "wrapWithDirectory": true,
        "pin": true
      },
      (err, ipfsHash) => err || resolve(ipfsHash))
  })
}

export default ipfsPublish
