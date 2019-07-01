import React, { useState } from 'react'

import './input-area.css'

const InputArea = ({ title, inputs }) => {
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
        <div className='inputArea-body'>{inputs}</div>
      ) : ''}
    </div>
  )
}

export default InputArea
