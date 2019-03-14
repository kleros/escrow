import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { BeatLoader } from 'react-spinners'

import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import EmailForm from '../../components/email-form'

import './settings.css'

const Settings = ({
  settings,
  updateEmail,
}) => (
  <div className="Settings">
    <RenderIf
      resource={settings}
      loading={
        <BeatLoader className='loader' color={'gray'} />
      }
      updating={
        <BeatLoader className='loader' color={'gray'} />
      }
      done={
        settings.data && (
          <EmailForm
            updateEmail={updateEmail}
            msg={
              `Save an email to be notified whenever you have a dispute,
              an appeal or when the arbitrator give a ruling for your
              arbitrable transaction.`
            }
          />
        )
      }
      failedLoading="There was an error fetching your settings."
      failedUpdating="There was an error updating your settings."
    />
  </div>
)

Settings.propTypes = {
  // Redux State
  settings: walletSelectors.settingsShape.isRequired,

  // Action Dispatchers
  updateEmail: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    settings: state.wallet.settings
  }),
  {
    updateEmail: walletActions.updateEmail
  }
)(Settings)