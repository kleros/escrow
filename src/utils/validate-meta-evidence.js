import { ARBITRABLE_ADDRESSES, ARBITRABLE_TOKEN_ADDRESSES } from '../bootstrap/dapp-api'
import _ from 'lodash'

import { metaEvidenceTemplates } from './generate-meta-evidence'

const bannedKeys = ['dynamicScriptURI']

const validateMetaEvidence = (_metaEvidence) => {
  // Must match one of the templates
  let templatePassed = false
  for (const template of metaEvidenceTemplates) {
    let _templateCheck = true
    for (const key of Object.keys(template)) {
      if (!_.isEqual(template[key], _metaEvidence[key])) {
        _templateCheck = false
        break
      }
    }

    if (_templateCheck) {
      templatePassed = true
      break
    }
  }

  if (!templatePassed) return false

  // All template keys match
  for (const key of bannedKeys) {
    if (_metaEvidence[key] !== undefined) {
      return false
    }
  }
  // Arbitable contract is a Kleros contract
  if (
    ARBITRABLE_ADDRESSES.indexOf(_metaEvidence.arbitrableAddress) === -1 &&
    ARBITRABLE_TOKEN_ADDRESSES.indexOf(_metaEvidence.arbitrableAddress) === -1
  ) {
    return false
  }

  return true
}

export default validateMetaEvidence
