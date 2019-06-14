import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import SearchInput, {createFilter} from 'react-search-input'
import ethSymbol from '../../assets/eth.png'

import './token-selector-box.css'

const KEYS_TO_FILTERS = ['name', 'ticker']

const TokenSelectorBox = ({ tokens, tokenIndex, submit }) => {
  const [selectedIndex, setIndex] = useState(tokenIndex)
  const [searchTerm, setSearchTerm] = useState('')

  const changeSelection = (index) => {
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
          <SearchInput className="search-input" onChange={(term) => {setSearchTerm(term)}} />
          <h3>Tokens</h3>
          <div className="tokens-container">
            { filteredTokens.slice(0,5).map((token, i) => (
              <div className={`token-option ${tokens[selectedIndex].ticker === token.ticker ? 'selected' : ''}`} onClick={() => changeSelection(i)}>
                <img src={token.symbolURI} />
                <div className="name">
                  {token.name}
                </div>
                <div className="ticker">
                  {token.ticker}
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
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
    </div>
  )
}

export default TokenSelectorBox
