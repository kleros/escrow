export default ({
  buyer,
  seller,
  title,
  description,
  fileURI,
  fileHash,
  amount,
  arbitrator
}) => (
  {
    category: 'Escrow',
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
      [buyer]: 'Party A',
      [seller]: 'Party B'
    },
    seller,
    amount,
    arbitrator
  }
)