import React, { useState } from 'react'
import { Field } from 'formik'
import Modal from 'react-responsive-modal'

import TokenSelectorBox from '../token-selector-box'
import warningSymbol from '../../assets/warning.png'
import downArrow from '../../assets/down-arrow.png'
import ETH from '../../constants/eth'

import './token-select-input.css'

const TokenSelectInput = ({ tokens, onSubmit, stablecoins }) => {
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
      onSubmit(tokens[tokens.length - 1])
    } else {
      onSubmit(tokens[tokenIndex])
    }

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
                stablecoins={stablecoins}
              />
            </Modal>
            <div
              className='TokenSelectInput'
              onClick={() => setModal(!open)}
            >
              <img src={tokens[tokenIndex].symbolURI ? tokens[tokenIndex].symbolURI : warningSymbol} alt="token-symbol" />
              { tokens[tokenIndex].ticker }
              <img src={downArrow} className="down-arrow" alt="down-arrow" />
            </div>
          </div>
        )
      }
    />
  )
}

export default TokenSelectInput
