import React from 'react'

import {
  BLOCKCHAIN_NON_TECHNICAL_MULTIPLE_ARBITRABLE_INDEX,
  GENERAL_MULTIPLE_ARBITRABLE_INDEX
} from '../constants/addresses'

import {
  ARBITRABLE_ADDRESSES
} from '../bootstrap/dapp-api'


import CryptoTransactionLogo from '../assets/crypto-transaction.png'
import CryptoTransactionLogoWhite from '../assets/crypto-transaction-white.png'
import GeneralServiceLogo from '../assets/general-service.png'
import GeneralServiceLogoWhite from '../assets/general-service-white.png'

const templates = [
  {
    value: 'cryptocurrency-transaction',
    logo: CryptoTransactionLogo,
    logoWhite: CryptoTransactionLogoWhite,
    optionalInputs: {
      'Blockchain': 'text',
      'Address': 'text',
      'Cryptoasset Description': 'text',
      'Due Date': 'date'
    },
    label: 'Cryptocurrency Transaction',
    description: 'Escrow funds to facilitate a crypto transaction. This can be used to for a safe cross chain swap. One person escrows one side of the trade in an asset based on ETH, and the funds are released after the funds on another blockchain have been moved.',
    content:
      '[Blockchain] address [Address] should receive [Cryptoasset Description] from the sender before [Due Date].',
    tips: [
      (<div><span style={{fontWeight: 600}}>**</span> Replace [bracketed] information as seen in the example below:</div>),
      (<div>Bitcoin address 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa should receive 0.1 BTC from the sender before Sun Apr 28 2019 23:31 UTC.</div>)
    ],
    address: ARBITRABLE_ADDRESSES[BLOCKCHAIN_NON_TECHNICAL_MULTIPLE_ARBITRABLE_INDEX]
  },
  {
    value: 'general-transaction',
    logo: GeneralServiceLogo,
    logoWhite: GeneralServiceLogoWhite,
    label: 'General Service',
    description: 'Define your own terms for any service.',
    content:
      '[Contract Information]',
    tips: [
      (<div><span style={{fontWeight: 600}}>**</span> Replace [bracketed] information with your contract details. If a dispute is raised this will be resolved in the Kleros General Court</div>)
    ],
    address: ARBITRABLE_ADDRESSES[GENERAL_MULTIPLE_ARBITRABLE_INDEX]
  },
]

export const substituteTextOptionalInputs = (inputs, text) => {
  for (let key of Object.keys(inputs)) {
    if (inputs[key]) {
      text = text.replace(`[${key}]`, inputs[key])
    }
  }

  return text
}

export default templates
