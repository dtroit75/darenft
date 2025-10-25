'use client';

import { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { NFTCard } from '@/components/NFTCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RaffleNFT } from '@/app/types/raffle';

// Mock NFT data for demo
const mockNFTs: RaffleNFT[] = [
  {
    tokenId: '1',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    story: 'My first NFT on Base! This represents my journey into Web3 and the amazing community.',
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500',
    upvotes: 42,
    metadata: {
      name: 'Genesis Journey',
      description: 'First steps into Web3',
      image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500',
      attributes: [
        { trait_type: 'Story Type', value: 'Fan Story' },
        { trait_type: 'Rarity', value: 'Rare' },
      ],
    },
    timestamp: Date.now() - 86400000,
  },
  {
    tokenId: '2',
    owner: '0x83c61A2f34C8F4b77E8f8E65b5e7D0e82F9F8c8a',
    story: 'Built my first dApp on Base using OnchainKit. The experience was amazing!',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500',
    upvotes: 35,
    metadata: {
      name: 'Base Builder',
      description: 'Developer journey on Base',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500',
      attributes: [
        { trait_type: 'Story Type', value: 'Fan Story' },
        { trait_type: 'Rarity', value: 'Epic' },
      ],
    },
    timestamp: Date.now() - 172800000,
  },
  {
    tokenId: '3',
    owner: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    story: 'Celebrating the Base ecosystem with this NFT. Love the community and the speed!',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500',
    upvotes: 28,
    metadata: {
      name: 'Base Celebration',
      description: 'Community spirit on Base',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500',
      attributes: [
        { trait_type: 'Story Type', value: 'Fan Story' },
        { trait_type: 'Rarity', value: 'Common' },
      ],
    },
    timestamp: Date.now() - 259200000,
  },
  {
    tokenId: '4',
    owner: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    story: 'My favorite collectible from the Base NFT series. This one has special meaning!',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500',
    upvotes: 51,
    metadata: {
      name: 'Special Collectible',
      description: 'Rare Base NFT',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500',
      attributes: [
        { trait_type: 'Story Type', value: 'Collectible' },
        { trait_type: 'Rarity', value: 'Legendary' },
      ],
    },
    timestamp: Date.now() - 345600000,
  },
];

type SortOption = 'recent' | 'popular' | 'oldest';

export default function GalleryPage(): JSX.Element {
  const [nfts, setNfts] = useState<RaffleNFT[]>(mockNFTs);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [filteredNFTs, setFilteredNFTs] = useState<RaffleNFT[]>(mockNFTs);

  useEffect(() => {
    let filtered = [...nfts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.story.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    }

    setFilteredNFTs(filtered);
  }, [nfts, searchQuery, sortBy]);

  const handleUpvoted = (): void => {
    // In production, refetch NFT data from contract
    // For demo, just trigger a re-render
    setNfts([...nfts]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">NFT Gallery</h1>
          <p className="text-gray-600">
            Browse all minted NFTs and upvote your favorites to increase their raffle weight
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">{nfts.length}</div>
                <div className="text-sm text-gray-600">Total NFTs</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">
                  {nfts.reduce((sum, nft) => sum + nft.upvotes, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Upvotes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">
                  {Math.max(...nfts.map(nft => nft.upvotes))}
                </div>
                <div className="text-sm text-gray-600">Top Upvotes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">
                  {new Set(nfts.map(nft => nft.owner)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Owners</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search NFTs by name or story..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSortBy('popular');
                }}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NFT Grid */}
        {filteredNFTs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} onUpvoted={handleUpvoted} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-black mb-2">No NFTs Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'No NFTs have been minted yet'}
              </p>
              <Button
                onClick={() => (window.location.href = '/mint')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Mint Your First NFT
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              How Upvoting Works
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>• Each NFT starts with 0 upvotes</p>
              <p>• You can upvote any NFT except your own</p>
              <p>• More upvotes = higher raffle weight = better winning chances</p>
              <p>• Upvoting requires a small gas fee on Base</p>
              <p>• Your upvotes are recorded onchain permanently</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
