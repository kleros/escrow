import Web3 from 'web3'
import Archon from '@kleros/archon'

import * as _addresses from '../constants/addresses'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER_URL =
  process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER_URL`]
const PATCH_USER_SETTINGS_URL =
  process.env[`REACT_APP_${env}_PATCH_USER_SETTINGS_URL`]

let web3
if (process.env.NODE_ENV === 'test')
  web3 = new Web3(require('ganache-cli').provider())
else if (window.ethereum) web3 = new Web3(window.ethereum)
else if (window.web3 && window.web3.currentProvider)
  web3 = new Web3(window.web3.currentProvider)
else web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_PROVIDER_URL))

let ARBITRABLE_ADDRESSES = []
let T2CR_ADDRESS
let ERC20_ADDRESS
let STABLECOIN_ADDRESS
let ARBITRABLE_TOKEN_ADDRESSES = []
let TOKENS_VIEW_ADDRESS
web3.eth.net.getId().then(networkID => {
  let networkName
  switch (networkID) {
    case 1:
      networkName = 'MAINNET'
      break
    case 42:
      networkName = 'KOVAN'
      break
    default:
      break
  }

  ARBITRABLE_ADDRESSES = _addresses[`${networkName}_MULTIPLE_ARBITRABLE_TRANSACTION_ADDRESSES`]
  ARBITRABLE_TOKEN_ADDRESSES = _addresses[`${networkName}_MULTIPLE_ARBITRABLE_TOKEN_TRANSACTION_ADDRESSES`]
  T2CR_ADDRESS = _addresses[`${networkName}_T2CR_ADDRESS`]
  ERC20_ADDRESS = _addresses[`${networkName}_ERC20_BADGE_ADDRESS`]
  STABLECOIN_ADDRESS = _addresses[`${networkName}_STABLECOIN_BADGE_ADDRESS`]
  TOKENS_VIEW_ADDRESS = _addresses[`${networkName}_TOKENS_VIEW_ADDRESS`]
})

const archon = new Archon(web3.currentProvider, 'https://ipfs.kleros.io')

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/
export {
  ARBITRABLE_ADDRESSES,
  ARBITRABLE_TOKEN_ADDRESSES,
  T2CR_ADDRESS,
  ERC20_ADDRESS,
  STABLECOIN_ADDRESS,
  PATCH_USER_SETTINGS_URL,
  web3,
  archon,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp,
  TOKENS_VIEW_ADDRESS
}
