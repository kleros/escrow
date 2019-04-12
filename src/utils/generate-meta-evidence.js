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
    titles: ['Refund Sender', 'Pay Receiver'],
    descriptions: [
      'Select to return funds to the Sender',
      'Select to release funds to the Receiver'
    ]
  },
  aliases: {
    [sender]: 'sender',
    [receiver]: 'receiver'
  },
  evidenceDisplayInterfaceURI: '/ipfs/Qmbz8oKpSdxdN79EHwpUTfyKJf1cjddnePoD4w6kiw8n7g/index.html',
  sender,
  receiver,
  amount,
  timeout,
  arbitrator
})
