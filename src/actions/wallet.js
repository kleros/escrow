import { createActions } from 'lessdux'

/* Actions */

// Accounts
export const accounts = createActions('ACCOUNTS')

// Balance
export const balance = createActions('BALANCE')

// Settings
export const settings = {
  ...createActions('SETTINGS', { withUpdate: true }),
  UPDATE_EMAIL: 'UPDATE_SETTINGS_EMAIL'
}

/* Action Creators */

// Accounts
export const fetchAccounts = () => ({ type: accounts.FETCH })

// Balance
export const fetchBalance = () => ({ type: balance.FETCH })

// Settings
export const updateEmail = ({ email }) => ({
  type: settings.UPDATE_EMAIL,
  payload: { email }
})