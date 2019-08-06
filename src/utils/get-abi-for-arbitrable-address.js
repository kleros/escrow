import multipleArbitrableTransaction from '@kleros/kleros-interaction/build/contracts/MultipleArbitrableTransaction.json'

import {
  ARBITRABLE_ADDRESSES,
  ARBITRABLE_TOKEN_ADDRESSES
} from '../bootstrap/dapp-api'

import multipleArbitrableTokenTransaction from '../assets/abi/multipleArbitrableTokenTransaction.json'


/**
 * We need to use different ABI's for different contract addresses, even if they have the same function sigs.
 */


export const getAbiForArbitrableAddress = (arbitrableAddress) => {
  for (let address of ARBITRABLE_ADDRESSES) {
    if (address.toLowerCase() === arbitrableAddress.toLowerCase())
      return multipleArbitrableTransaction.abi
  }

  for (let address of ARBITRABLE_TOKEN_ADDRESSES) {
    if (address.toLowerCase() === arbitrableAddress.toLowerCase())
      return multipleArbitrableTokenTransaction.abi
  }
}
