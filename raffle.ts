export interface RaffleNFT {
  tokenId: string;
  owner: string;
  story: string;
  imageUrl: string;
  upvotes: number;
  metadata: NFTMetadata;
  timestamp: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface RaffleRound {
  id: string;
  startTime: number;
  endTime: number;
  status: 'active' | 'drawing' | 'completed';
  winner?: string;
  totalEntries: number;
  vrfRequestId?: string;
}

export interface UserProfile {
  address: string;
  basename?: string;
  nftsOwned: number;
  totalUpvotes: number;
  rafflesWon: number;
}
