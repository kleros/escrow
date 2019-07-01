import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BeatLoader } from 'react-spinners'
import SearchInput, {createFilter} from 'react-search-input'

import ethSymbol from '../../assets/eth.png'
import warningSymbol from '../../assets/warning.png'

import './token-selector-box.css'

const KEYS_TO_FILTERS = ['name', 'ticker']

const TokenSelectorBox = ({ tokens, tokenIndex, submit }) => {
  const [selectedIndex, setIndex] = useState(tokenIndex)
  const [searchTerm, setSearchTerm] = useState('')
  const [newTokenName, setTokenName] = useState(null)
  const [newTokenTicker, setTokenTicker] = useState(null)
  const [newTokenAddress, setTokenAddress] = useState(null)
  const [newTokenDecimals, setTokenDecimals] = useState(null)

  const changeSelection = (ticker) => {
    const index = tokens.findIndex((_token) => {
      return _token.ticker === ticker
    })
    setIndex(index)
  }

  const filteredTokens = tokens.filter(createFilter(searchTerm, KEYS_TO_FILTERS))

  return (
    <div className="TokenSelectorBox">
      <Tabs>
        <TabList>
          <Tab>Tokens</Tab>
          <Tab>Add Custom Token</Tab>
        </TabList>

        <TabPanel>
          <div className="token-select">
            <SearchInput className="search-input" onChange={(term) => {setSearchTerm(term)}} />
            <h3>Tokens</h3>
            <div className="tokens-container">
              { filteredTokens.map((token, i) => (
                <div className={`token-option ${tokens[selectedIndex].ticker === token.ticker ? 'selected' : ''}`} onClick={() => changeSelection(token.ticker)}>
                  <div className="tokenImg">
                    <img src={token.symbolURI ? token.symbolURI : warningSymbol} />
                  </div>
                  <div className="name">
                    {token.name}
                  </div>
                  <div className="ticker">
                    {token.ticker}
                  </div>
                </div>
              ))}
              {
                tokens.length === 1 ? (
                  <div className='loading-icon'>
                    <BeatLoader />
                  </div>
                ) : ''
              }
            </div>
          </div>
          <div className='buttons'>
            <div
              className='return-button'
              onClick={() => {submit(tokenIndex)}}
            >
              Return
            </div>
            <div
              className='submit-button'
              onClick={() => {submit(selectedIndex)}}
            >
              Select Token
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="custom-token">
            <div className="custom-token-input">
              Address
              <input type="text" onChange={(e) => {setTokenAddress(e.target.value)}}></input>
            </div>
            <div className="custom-token-input">
              Name
              <input type="text" onChange={(e) => {setTokenName(e.target.value)}}></input>
            </div>
            <div className="custom-token-input">
              Ticker
              <input type="text" onChange={(e) => {setTokenTicker(e.target.value)}}></input>
            </div>
            <div className="custom-token-input">
              Decimals of Precision
              <input type="text" onChange={(e) => {setTokenDecimals(e.target.value)}}></input>
            </div>
            <div className="custom-token-warning">
              <div className="symbol">
                <img src={warningSymbol} />
              </div>
              <div className="text">
                The Custom Token must follow the ERC20 standard. If it does not follow this standard you risk tokens being locked in the Escrow Smart Contract. Verified ERC20 tokens are from the Kleros T2CR. You can follow instructions to verify this token.
              </div>
            </div>
          </div>
          <div className='buttons'>
            <div
              className='return-button'
              onClick={() => {submit(tokenIndex)}}
            >
              Return
            </div>
            <div
              className={`submit-button ${!newTokenName || !newTokenTicker || !newTokenAddress || !newTokenDecimals ? 'disabled' : ''}`}
              onClick={(e) => {
                if (e.target.classList.contains('disabled')) return
                submit(
                  undefined,
                  {
                    name: newTokenName,
                    ticker: newTokenTicker,
                    address: newTokenAddress,
                    decimals: newTokenDecimals
                  }
                )
              }}
            >
              Add
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default TokenSelectorBox
