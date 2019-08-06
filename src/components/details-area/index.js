import React, { useState } from 'react'

import './details-area.css'

const DetailsArea = ({ title, inputs, headerSpacing=false }) => {
  const [showInputs, setShowInputs] = useState(true)

  return (
    <div className='inputArea'>
      <div className='inputArea-header'>
        <div className='inputArea-header-title'>{title}</div>
        <div
          className={
            `inputArea-header-button ${showInputs ?
             'inputArea-header-down' :
             'inputArea-header-up'}`
           }
           onClick={() => setShowInputs(!showInputs)} />
      </div>
      {showInputs ? (
        <div className='inputArea-body' style={headerSpacing ? {marginTop: '25px'} : {}}>{inputs}</div>
      ) : ''}
    </div>
  )
}

export default DetailsArea
