import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { BeatLoader } from 'react-spinners'

import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import EmailForm from '../../components/email-form'

import './settings.css'

const Settings = ({ settings, updateEmail }) => (
  <div className="Settings">
    <RenderIf
      resource={settings}
      loading={<BeatLoader className="loader" color={'#fff'} />}
      updating={<BeatLoader className="loader" color={'#fff'} />}
      done={
        settings.data && (
          <EmailForm
            updateEmail={updateEmail}
            msg="I wish to be notified when:"
            settingsAcc={settings}
          />
        )
      }
      failedLoading={
        <EmailForm
          updateEmail={updateEmail}
          msg="I wish to be notified when:"
          settingsAcc={settings}
        />
      }
      failedUpdating={
        <EmailForm
          updateEmail={updateEmail}
          msg="I wish to be notified when:"
          settingsAcc={settings}
        />
      }
    />
  </div>
)

Settings.propTypes = {
  // Redux State
  settings: walletSelectors.settingsShape.isRequired,

  // Action Dispatchers
  updateEmail: PropTypes.func.isRequired
}

export default connect(
  state => ({
    settings: state.wallet.settings
  }),
  {
    updateEmail: walletActions.updateEmail
  }
)(Settings)
