export default ({
  arbitrableAddress,
  sender,
  receiver,
  title,
  description,
  fileURI,
  fileHash,
  amount,
  timeout,
  arbitrator,
  subCategory
}) => ({
  category: 'Escrow',
  subCategory,
  arbitrableAddress,
  title,
  description,
  fileURI,
  fileHash,
  question: 'Which party abided by terms of the contract?',
  rulingOptions: {
    titles: ['Vote for the Sender', 'Vote for the Receiver'],
    descriptions: [
      'Select to return funds to the Sender',
      'Select to release funds to the Receiver'
    ]
  },
  aliases: {
    [sender]: 'sender',
    [receiver]: 'receiver'
  },
  sender,
  receiver,
  amount,
  timeout,
  arbitrator
})
