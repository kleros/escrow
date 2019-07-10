import { ARBITRABLE_ADDRESSES, ARBITRABLE_TOKEN_ADDRESSES } from '../bootstrap/dapp-api'
import _ from 'lodash'

import { metaEvidenceTemplate } from './generate-meta-evidence'

const bannedKeys = ['dynamicScriptURI']

const validateMetaEvidence = (_metaEvidence) => {
  // All template values match
  for (const key of Object.keys(metaEvidenceTemplate)) {
    if (!_.isEqual(metaEvidenceTemplate[key], _metaEvidence[key])) {
      console.log(key)
      return false
    }
  }
  // All template keys match
  for (const key of bannedKeys) {
    if (_metaEvidence[key] !== undefined) {
      console.log(key)
      return false
    }
  }
  // Arbitable contract is a Kleros contract
  if (
    ARBITRABLE_ADDRESSES.indexOf(_metaEvidence.arbitrableAddress) === -1 &&
    ARBITRABLE_TOKEN_ADDRESSES.indexOf(_metaEvidence.arbitrableAddress) === -1
  ) {
    console.log(ARBITRABLE_ADDRESSES)
    console.log(_metaEvidence.arbitrableAddress)
    return false
  }

  return true
}

export default validateMetaEvidence
