import { ARBITRABLE_ADDRESSES } from '../bootstrap/dapp-api'
import _ from 'lodash'

import { metaEvidenceTemplate } from './generate-meta-evidence'

const bannedKeys = ['dynamicScriptURI']

const validateMetaEvidence = (_metaEvidence) => {
  // All template values match
  for (const key of Object.keys(metaEvidenceTemplate)) {
    if (!_.isEqual(metaEvidenceTemplate[key], _metaEvidence[key]))
      return false
  }
  // All template keys match
  for (const key of bannedKeys) {
    if (_metaEvidence[key] !== undefined)
      return false
  }
  // Arbitable contract is a Kleros contract
  if (ARBITRABLE_ADDRESSES.indexOf(_metaEvidence.arbitrableAddress) === -1)
    return false

  return true
}

export default validateMetaEvidence
