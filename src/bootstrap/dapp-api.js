import Web3 from 'web3'
import Archon from '@kleros/archon'
import arbitrator from '@kleros/kleros-interaction/build/contracts/Arbitrator.json'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER_URL =
  process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER_URL`]
const ARBITRATOR_ADDRESS = process.env[`REACT_APP_${env}_ARBITRATOR_ADDRESS`]
const ARBITRABLE_ADDRESSES = [
  {
    address: process.env[`REACT_APP_${env}_ARBITRABLE_NONTECHNICAL_ADDRESS`],
    type: 'General'
  }
]
const PATCH_USER_SETTINGS_URL =
  process.env[`REACT_APP_${env}_PATCH_USER_SETTINGS_URL`]

let web3
if (process.env.NODE_ENV === 'test')
  web3 = new Web3(require('ganache-cli').provider())
else if (window.ethereum) web3 = new Web3(window.ethereum)
else if (window.web3 && window.web3.currentProvider)
  web3 = new Web3(window.web3.currentProvider)
else web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_PROVIDER_URL))

const archon = new Archon(ETHEREUM_PROVIDER_URL, 'https://ipfs.kleros.io')
const arbitratorEth = new web3.eth.Contract(arbitrator.abi, ARBITRATOR_ADDRESS)

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/

export {
  ARBITRATOR_ADDRESS,
  ARBITRABLE_ADDRESSES,
  PATCH_USER_SETTINGS_URL,
  web3,
  archon,
  arbitratorEth,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp
}
