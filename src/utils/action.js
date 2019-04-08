export const action = (type, payload, meta) => ({
  type,
  payload,
  meta
})
export const errorAction = (type, err) =>
  console.error(err) || { type, payload: err, error: true }
