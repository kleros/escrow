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
}) => (
  {
    category: 'Escrow',
    subCategory,
    arbitrableAddress,
    title,
    description,
    fileURI,
    fileHash,
    question: 'Which party abided by terms of the contract?',
    rulingOptions: {
      titles: ['Vote for Party A', 'Vote for Party B'],
      descriptions: ['Select to return funds to Party A', 'Select to release funds to Party B'],
    },
    aliases: {
      [sender]: 'Sender',
      [receiver]: 'Receiver'
    },
    sender,
    receiver,
    amount,
    timeout,
    arbitrator
  }
)