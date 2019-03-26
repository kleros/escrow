import React from 'react'
import PropTypes from 'prop-types'

import metaMaskLogo from '../../assets/meta-mask-logo.png'
import './requires-meta-mask-page.css'

const RequiresMetamaskPage = ({
  needsUnlock
}) => (
  <>
    <div className="RequiresMetamaskPage">
      <img
        alt="MetaMask Logo"
        className="RequiresMetamaskPage-logo"
        src={metaMaskLogo}
      />
      <div className="RequiresMetamaskPage-content">
        {needsUnlock ? (
          <>
            <h1 className="RequiresMetamaskPage-title">You need a Web3 enabled browser to run this dapp</h1>
            <small>
              We recommend using Chrome with the MetaMask extension. 
              <br />This also serves as your login so you won't need to keep track of another
              account and password.
            </small>
            <div>
              <br />
              <a className="RequiresMetamaskPage-support-a" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">
                Install MetaMask
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="RequiresMetamaskPage-title">Wrong Metamask network configuration</h1>
            <p>
              Please ensure Metamask is set to the{' '}
              <strong>Main</strong> ethereum network
            </p>
          </>
        )}
      </div>
    </div>
    <div className="RequiresMetamaskPage-FAQ">
      <p>Still have questions? Don't worry, we're here to help!</p>
      <div className="RequiresMetamaskPage-support">
        <a
          className="RequiresMetamaskPage-support-a"
          href="mailto:stuart@kleros.io?Subject=Tokens%20on%20Trial%20Support"
        >
          Contact Support
        </a>
        <a
          className="RequiresMetamaskPage-support-a"
          href="https://t.me/kleros"
        >
          Ask in Telegram
        </a>
      </div>
    </div>
  </>
)

RequiresMetamaskPage.propTypes = {
  needsUnlock: PropTypes.bool.isRequired
}

RequiresMetamaskPage.defaultProps = {
  metamaskNetwork: ''
}

export default RequiresMetamaskPage