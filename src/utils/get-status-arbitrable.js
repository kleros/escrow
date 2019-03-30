import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import * as statusArbitrableTxConstants from '../constants/status-arbitrable-tx'

export default ({
  accounts, 
  arbitrabletx
}) => {
  // eslint-disable-next-line default-case
  switch(arbitrabletx.status) {
    case arbitrableTxConstants.NO_DISPUTE:
      if(arbitrabletx.amount === '0')
        return statusArbitrableTxConstants.TRANSACTION_COMPLETED
      else if(Date.now() - arbitrabletx.lastInteraction * 1000 >= arbitrabletx.timeoutPayment * 1000 && accounts[0] === arbitrabletx.sender)
          return statusArbitrableTxConstants.EXECUTE_PAYMENT
      else if (arbitrabletx.amount !== arbitrabletx.originalAmount)
        return statusArbitrableTxConstants.ONGOING_SETTLEMENT
      return statusArbitrableTxConstants.ONGOING_TRANSACTION
    case arbitrableTxConstants.WAITING_RECEIVER:
      if(!isFeePaid(arbitrabletx))
        return statusArbitrableTxConstants.HAS_TO_PAY_RECEIVER
      else if (timeout(arbitrabletx) === 0 && accounts[0] === arbitrabletx.sender)
        return statusArbitrableTxConstants.TIMEOUT_SENDER
      return statusArbitrableTxConstants.WAITING_RECEIVER
    case arbitrableTxConstants.WAITING_SENDER:
      if(!isFeePaid(arbitrabletx))
        return statusArbitrableTxConstants.HAS_TO_PAY_SENDER
      else if (timeout(arbitrabletx) === 0 && accounts[0] === arbitrabletx.receiver)
        return statusArbitrableTxConstants.TIMEOUT_RECEIVER
      return statusArbitrableTxConstants.WAITING_SENDER
    case arbitrableTxConstants.DISPUTE_CREATED:
      return statusArbitrableTxConstants.ONGOING_DISPUTE
    case arbitrableTxConstants.DISPUTE_RESOLVED:
      if(arbitrabletx.ruling === null)
        return statusArbitrableTxConstants.TRANSACTION_COMPLETED
      else if(arbitrabletx.appealable === true)
        // eslint-disable-next-line no-mixed-operators
        if(arbitrabletx.ruling === '1' || arbitrabletx.ruling === '0' && accounts[0] === arbitrabletx.receiver)
          return statusArbitrableTxConstants.APPEALABLE_WINNER
        // eslint-disable-next-line no-mixed-operators
        if(arbitrabletx.ruling === '2' || arbitrabletx.ruling === '0' && accounts[0] === arbitrabletx.receiver)
          return statusArbitrableTxConstants.APPEALABLE_LOOSER
      return statusArbitrableTxConstants.DISPUTE_RESOLVED
  }
}

const timeout = arbitrabletx => ((Number(arbitrabletx.lastInteraction) + Number(arbitrabletx.feeTimeout)) * 1000) - Date.now() > 0

const isFeePaid = arbitrabletx => arbitrabletx[`${arbitrabletx.party}Fee`] > 0 // FIXME: Must equal to the arbitration cost