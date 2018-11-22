import { ipfs } from '../../bootstrap/dapp-api'

const ipfsPublish = async file => {
  const buffer = await Buffer.from(file)
  return new Promise(resolve => {
    ipfs.add(buffer, (err, ipfsHash) => err || resolve(ipfsHash))
  })
}

export default ipfsPublish