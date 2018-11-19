import { createActions } from 'lessdux'

/* Actions */

// Accounts
export const accounts = createActions('ACCOUNTS')

// Balance
export const balance = createActions('BALANCE')

/* Action Creators */

// Accounts
export const fetchAccounts = () => ({ type: accounts.FETCH })

// Balance
export const fetchBalance = () => ({ type: balance.FETCH })