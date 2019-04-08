import { createActions } from 'lessdux'

/* Actions */

// Accounts
export const accounts = createActions('ACCOUNTS')

// Balance
export const balance = createActions('BALANCE')

// Settings
export const settingsEmail = {
  ...createActions('SETTINGS', { withUpdate: true }),
  UPDATE_EMAIL: 'UPDATE_SETTINGS_EMAIL'
}

/* Action Creators */

// Accounts
export const fetchAccounts = () => ({ type: accounts.FETCH })

// Balance
export const fetchBalance = () => ({ type: balance.FETCH })

// Settings
export const updateEmail = ({ settings }) => ({
  type: settingsEmail.UPDATE_EMAIL,
  payload: { settings }
})
