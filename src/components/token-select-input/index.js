import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, ErrorMessage } from 'formik'
import Select from 'react-select'
import Modal from 'react-responsive-modal'

import TokenSelectorBox from '../token-selector-box'
import warningSymbol from '../../assets/warning.png'
import ETH from '../../constants/eth'

import './token-select-input.css'

const TokenSelectInput = ({ tokens, onSubmit }) => {
  // Add ETH as the first option
  if (!tokens) tokens = []
  if (!tokens[0] || tokens[0].name !== ETH.name)
    tokens.unshift(ETH)

  const [open, setModal] = useState(false)
  const [tokenIndex, setIndex] = useState(0)

  const updateSelectedToken = (tokenIndex, newToken) => {
    if (tokenIndex !== undefined) {
      setIndex(tokenIndex)
    }

    if (newToken) {
      tokens.push(newToken)
      setIndex(tokens.length - 1)
    }

    onSubmit(tokens[tokenIndex])

    setModal(!open)
  }

  return (
    <Field
      name="token"
      render={() => (
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
              <img src={tokens[tokenIndex].symbolURI ? tokens[tokenIndex].symbolURI : warningSymbol} />
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
