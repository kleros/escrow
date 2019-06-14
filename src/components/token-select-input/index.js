import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, ErrorMessage } from 'formik'
import Select from 'react-select'
import Modal from 'react-responsive-modal'

import TokenSelectorBox from '../token-selector-box'
import ethSymbol from '../../assets/eth.png'

import './token-select-input.css'

const eth = {
  name: 'Ethereum',
  ticker: 'ETH',
  symbolURI: ethSymbol,
  address: null
}

const TokenSelectInput = ({ tokens }) => {
  if (!tokens) return null

  // Add ETH as the first option
  if (tokens[0].name !== eth.name)
    tokens.unshift(eth)

  const [open, setModal] = useState(false)
  const [tokenIndex, setIndex] = useState(0)

  const updateSelectedToken = (tokenIndex) => {
    setIndex(tokenIndex)

    setModal(!open)
  }

  return (
    <Field
      name="token"
      render={({ form }) => (
          <div>
            <Modal
              open={open}
              onClose={() => setModal(!open)}
              center
              classNames={{
                modal: 'setToken-modal'
              }}
            >
              <TokenSelectorBox
                tokens={tokens}
                tokenIndex={tokenIndex}
                submit={updateSelectedToken}
              />
            </Modal>
            <div
              className='TokenSelectInput'
              onClick={() => setModal(!open)}
            >
              <img src={tokens[tokenIndex].symbolURI} />
              {tokens[tokenIndex].ticker}
              <div className='arrow' />
            </div>
          </div>
        )
      }
    />
  )
}

export default TokenSelectInput
