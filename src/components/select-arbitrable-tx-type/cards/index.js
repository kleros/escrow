import React from 'react'

import './select-arbitrable-tx-type-card.css'

const SelectArbitrableTxTypeCard = ({ template, selected, select }) => {
  return (
    <div
      className={`SelectArbitrableTxTypeCard ${selected ? 'SelectArbitrableTxTypeCard-selected' : ''}`}
      onClick={() => {select(template)}}
    >
      <img src={selected ? template.logoWhite : template.logo} alt="template-logo" />
      <h4>{template.label}</h4>
    </div>
  )
}

export default SelectArbitrableTxTypeCard
