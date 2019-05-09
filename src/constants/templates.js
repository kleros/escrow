import React from 'react'

import {
  BLOCKCHAIN_NON_TECHNICAL_MULTIPLE_ARBITRABLE_INDEX,
  GENERAL_MULTIPLE_ARBITRABLE_INDEX
} from '../constants/addresses'

import {
  ARBITRABLE_ADDRESSES
} from '../bootstrap/dapp-api'

const templates = [
  {
    value: 'cryptocurrency-transaction',
    label: 'Cryptocurrency Transaction',
    content:
      '[Blockchain] address [Address] should receive [Cryptoasset Description] from the sender before [Due Date (Note: this is before and not the same as the payment\'s timeout.)].',
    tips: [
      (<div><span style={{fontWeight: 600}}>**</span> Replace [bracketed] information as seen in the example below:</div>),
      (<div>Bitcoin address 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa should receive 0.1 BTC from the sender before Sun Apr 28 2019 23:31 UTC.</div>)
    ],
    address: ARBITRABLE_ADDRESSES[BLOCKCHAIN_NON_TECHNICAL_MULTIPLE_ARBITRABLE_INDEX]
  },
  {
    value: 'general-transaction',
    label: 'General Service',
    content:
      '[Contract Information]',
    tips: [
      (<div><span style={{fontWeight: 600}}>**</span> Replace [bracketed] information with your contract details. If a dispute is raised this will be resolved in the Kleros General Court</div>)
    ],
    address: ARBITRABLE_ADDRESSES[GENERAL_MULTIPLE_ARBITRABLE_INDEX]
  },
]

export default templates
