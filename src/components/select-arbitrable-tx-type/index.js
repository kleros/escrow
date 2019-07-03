import React, { useState } from 'react'

import './select-arbitrable-tx.css'
import SelectArbitrableTxTypeCard from './cards'
import Logo from '../../assets/BBB.png'

const SelectArbitrableTxType = ({ templates, selectedTemplate, submit }) => {
  if (!templates || !selectedTemplate) return null
  const [template, setTemplate] = useState(selectedTemplate)

  return (
    <div className="SelectArbitrableTxType">
      <div className="SelectArbitrableTxType-logo">
        <img src={Logo} />
      </div>
      <div className="SelectArbitrableTxType-header">
        <h2>Select the Escrow Type</h2>
      </div>
      <div className="SelectArbitrableTxType-cards">
        {templates.map(_template => (
            <SelectArbitrableTxTypeCard
              template={_template}
              selected={_template.label === template.label}
              select={() => setTemplate(_template)}
            />
          )
        )}
      </div>
      <div className="SelectArbitrableTxType-description">
        <div className="SelectArbitrableTxType-description-label">
          {template.label}
        </div>
        <div className="SelectArbitrableTxType-description-body">
          {template.description}
        </div>
        <div
          className="SelectArbitrableTxType-description-next"
          onClick={() => {
            requestAnimationFrame(() => {
              window.scrollTo(0, 0)
            })
            submit(template)
          }}
        >
          Next
        </div>
      </div>
    </div>
  )
}

export default SelectArbitrableTxType
