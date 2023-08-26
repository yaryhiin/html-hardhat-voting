export const contractAddress = "0x96Db53145d7dFECc075Ffe6da7D57558A20778B0";
export const abi = [
  {
    "inputs": [],
    "name": "alreadyCandidate",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "alreadyVoted",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_candidate",
        "type": "address"
      }
    ],
    "name": "Vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_candidateName",
        "type": "string"
      }
    ],
    "name": "becomeCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_candidate",
        "type": "address"
      }
    ],
    "name": "getCandidateName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getCandidates",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_candidate",
        "type": "address"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]