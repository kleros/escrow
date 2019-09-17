import { createActions } from 'lessdux'

export const stablecoins = createActions('STABLECOINS')
export const fetchStablecoins = () => ({ type: stablecoins.FETCH })
