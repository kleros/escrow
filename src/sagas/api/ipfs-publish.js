import Archon from '@kleros/archon'

import { web3, ipfs } from '../../bootstrap/dapp-api'

const ipfsPublish = async file => {
  const buffer = await Buffer.from(file);
  await ipfs.add(buffer, (err, ipfsHash) => {
    console.log(err, ipfsHash)
    return ipfsHash
  })
}

export default ipfsPublish