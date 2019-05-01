import React from 'react'

const templates = [
  {
    value: 'cryptocurrency-transaction',
    label: 'Cryptocurrency Transaction',
    content:
      '[Blockchain] address [Address] should receive [Cryptoasset Description] from the sender before [Due Date (Note: this is before and not the same as the payment\'s timeout.)].',
    tips: [
      (<div><span style={{fontWeight: 600}}>**</span> Replace [bracketed] information as seen in the example below:</div>),
      (<div>Bitcoin address 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa should receive 0.1 BTC from the sender before Sun Apr 28 2019 23:31 UTC.</div>)
    ]
  }
]

export default templates
