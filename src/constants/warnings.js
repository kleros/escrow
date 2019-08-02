import React from 'react'

export const ADDRESS_WARNING = (address) => (
  <span>- This token has not been verified. Please check the <a target="_" href={`https://etherscan.io/token/${address}`}>token address</a> to ensure this is the asset that you expect. Note: Ticker and Name do not guarantee this is the correct asset.</span>
)

export const REUSED_TOKEN_WARNING = (item) => (
  <span>- This token's {item} does not match a verified token with the same address.</span>
)

export const DECIMAL_WARNING = (decimals) => (
  <span>- The decimals for this token cannot be verified. This token is using {decimals} decimals. Verify that this is the expected decimal places for this asset. Note: Incorrect decimal places effect the amount in escrow. Note: Most tokens use 18 decimal places.</span>
)

export const DECIMALS_NOTICE = (decimals) => (
  <span>- This token is using {decimals} decimals.</span>
)
