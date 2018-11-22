export default function awaitTx(web3, txnHash, options) {
    let interval = options && options.interval ? options.interval : 500
    let blocksToWait = options && options.blocksToWait ? options.blocksToWait : 12
    const transactionReceiptAsync = async function(txnHash, resolve, reject) {
        try {
            let receipt = web3.eth.getTransactionReceipt(txnHash)
            if (!receipt) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject)
                }, interval)
            } else {
              if (options && options.ensureNotUncle) {
                let resolvedReceipt = await receipt
                if (!resolvedReceipt || !resolvedReceipt.blockNumber) setTimeout(function () { transactionReceiptAsync(txnHash, resolve, reject)
                }, interval)
                else {
                  try {
                  let block = await web3.eth.getBlock(resolvedReceipt.blockNumber)
                  let current = await web3.eth.getBlock('latest')
                  if (current.number - block.number >= blocksToWait) {
                    let txn = await web3.eth.getTransaction(txnHash)
                    if (txn.blockNumber != null) resolve(resolvedReceipt)
                    else reject(new Error('Transaction with hash: ' + txnHash + ' ended up in an uncle block.'))
                  }
                  else setTimeout(function () {
                      transactionReceiptAsync(txnHash, resolve, reject);
                  }, interval)
                  }
                  catch (e) {
                    setTimeout(function () {
                        transactionReceiptAsync(txnHash, resolve, reject);
                    }, interval)
                  }
                }
              }
              else resolve(receipt)
            }
        } catch(e) {
            reject(e)
        }
    }

    return new Promise(function (resolve, reject) {
        transactionReceiptAsync(txnHash, resolve, reject);
    })
}