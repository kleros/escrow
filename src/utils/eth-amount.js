
/**
 * For amounts we want to do either: whole number with n decimal places or
 * n significant figures. This is to display small amounts.
 */
export const truncateAmount = (amount, places) => {
  amount = parseFloat(amount)
  if (amount >= 1) {
    return parseFloat(
      parseFloat(amount).toFixed(places)
    ).toString()
  } else {
    return parseFloat(Number.parseFloat(amount).toPrecision(places)).toString()
  }
}

export default truncateAmount
