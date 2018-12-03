import statusHelper from '../../utils/api-status-helper'

const getMetaEvidence = {
  getFile(ipfsHash) {
    return fetch(`https://ipfs.kleros.io/ipfs/${ipfsHash}/metaEvidence.json`)
      .then(statusHelper)
      .then(response => response.json())
      .catch(err => err)
      .then(data => data)
  }
}

export default getMetaEvidence
