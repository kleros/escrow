import Web3 from 'web3'
import IPFS from 'ipfs-api'
import multipleArbitrableTransaction from 'kleros-interaction/build/contracts/MultipleArbitrableTransaction.json'
import arbitrator from 'kleros-interaction/build/contracts/Arbitrator.json'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]

let web3
if (process.env.NODE_ENV === 'test')
  web3 = new Web3(require('ganache-cli').provider())
else if (window.ethereum) web3 = new Web3(window.ethereum)
else if (window.web3 && window.web3.currentProvider)
  web3 = new Web3(window.web3.currentProvider)
else web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_PROVIDER))

let ARBITRABLE_ADDRESS
let multipleArbitrableTransactionEth

const network =
  web3.eth &&
  web3.eth.net
    .getId()
    .then(networkID => {
    switch (networkID) {
        case 1:
        return 'MAINNET'
        case 3:
        return 'ROPSTEN'
        case 4:
        return 'RINKEBY'
        case 42:
        return 'KOVAN'
        default:
        return null
    }
    })
    .catch(() => null)

ARBITRABLE_ADDRESS =
  process.env[`REACT_APP_${env}_ARBITRABLE_ADDRESS`]

multipleArbitrableTransactionEth = new web3.eth.Contract(
  multipleArbitrableTransaction.abi,
  ARBITRABLE_ADDRESS
)

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/

export {
  web3,
  ARBITRABLE_ADDRESS,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp,
  arbitrator,
  multipleArbitrableTransactionEth,
  ipfs
}

setTimeout(
  () =>
    console.log(
      'Arbitrable Address: ',
      ARBITRABLE_ADDRESS,
      'Web3: ',
      window.web3,
      'ARBITRATOR INTERFACE',
      arbitrator,
      'ARBITRBLE CONTRACT',
      multipleArbitrableTransactionEth,
      'NETWORK',
      network,
      'IPFS',
      ipfs
    ),
  1000
)