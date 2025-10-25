// Contract addresses for Base Sepolia (testnet)
export const CONTRACTS = {
  RAFFLE_NFT: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' as `0x${string}`,
  RAFFLE_MANAGER: '0x83c61A2f34C8F4b77E8f8E65b5e7D0e82F9F8c8a' as `0x${string}`,
  DARE_TOKEN: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
  CHAINLINK_VRF_COORDINATOR: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as `0x${string}`,
};

// RaffleNFT Contract ABI
export const RAFFLE_NFT_ABI = [
  {
    type: 'function',
    name: 'mintNFT',
    inputs: [
      { name: 'story', type: 'string' },
      { name: 'tokenURI', type: 'string' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'upvoteNFT',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getUpvotes',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'upvotes', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ownerOf',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenURI',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'NFTMinted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'story', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'NFTUpvoted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'voter', type: 'address', indexed: true },
      { name: 'totalUpvotes', type: 'uint256', indexed: false },
    ],
  },
] as const;

// RaffleManager Contract ABI
export const RAFFLE_MANAGER_ABI = [
  {
    type: 'function',
    name: 'createRaffle',
    inputs: [{ name: 'duration', type: 'uint256' }],
    outputs: [{ name: 'raffleId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'drawWinner',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getCurrentRaffle',
    inputs: [],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'totalEntries', type: 'uint256' },
      { name: 'winner', type: 'address' },
      { name: 'status', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claimPrize',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'RaffleCreated',
    inputs: [
      { name: 'raffleId', type: 'uint256', indexed: true },
      { name: 'endTime', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'WinnerSelected',
    inputs: [
      { name: 'raffleId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'randomness', type: 'uint256', indexed: false },
    ],
  },
] as const;

// DAREToken (ERC-20) ABI
export const DARE_TOKEN_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;
