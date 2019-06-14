import { createActions } from 'lessdux'

export const tokens = createActions('TOKENS')
export const fetchTokens = () => ({ type: tokens.FETCH })
