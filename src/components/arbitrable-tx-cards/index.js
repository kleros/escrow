import React from 'react'
import FA from 'react-fontawesome'

// import statusContract from '../../utils/status-contract'

/**
 * Contract Display List Component
 * @param contract
 * @param props - e.g. must receive this.props with a history field
 * @param accounts
 * @returns {*}
 * @constructor
 */
export const ArbitrableTxCards = ({
  accounts,
  arbitrabletxs,
  arbitrabletx
}) => (
  <div className="flex-container">

    {arbitrabletxs.map((arbitrabletx, i) => (
      <div
        className={`flex-item2`}
        key={i}
        // onClick={redirect(
        //   `/contracts/${contractArr.arbitrableTransactionId}`,
        //   history
        // )
        // }
      >
        {arbitrabletx[0]}
      </div>
    ))}

    {arbitrabletxs.length === 0 && (
        <div
          className="flex-item2 newContract"
        //   onClick={redirect('/contracts/new', history)}
        >
          <FA name="plus" size="2x" />
        </div>
      )}
  </div>
)