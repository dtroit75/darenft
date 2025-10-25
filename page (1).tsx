'use client';

import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import type { UserProfile } from '@/app/types/raffle';

// Mock leaderboard data
const topCreators: UserProfile[] = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    basename: 'alice.base',
    nftsOwned: 12,
    totalUpvotes: 156,
    rafflesWon: 3,
  },
  {
    address: '0x83c61A2f34C8F4b77E8f8E65b5e7D0e82F9F8c8a',
    basename: 'bob.base',
    nftsOwned: 8,
    totalUpvotes: 142,
    rafflesWon: 2,
  },
  {
    address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    basename: 'charlie.base',
    nftsOwned: 15,
    totalUpvotes: 128,
    rafflesWon: 1,
  },
  {
    address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    nftsOwned: 6,
    totalUpvotes: 98,
    rafflesWon: 1,
  },
];

const recentWinners: UserProfile[] = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    basename: 'alice.base',
    nftsOwned: 12,
    totalUpvotes: 156,
    rafflesWon: 3,
  },
  {
    address: '0x83c61A2f34C8F4b77E8f8E65b5e7D0e82F9F8c8a',
    basename: 'bob.base',
    nftsOwned: 8,
    totalUpvotes: 142,
    rafflesWon: 2,
  },
];

export default function LeaderboardPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('creators');

  const getMedalEmoji = (rank: number): string => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Leaderboard</h1>
          <p className="text-gray-600">
            Top creators, most upvoted NFTs, and raffle winners with Basenames
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-96 grid-cols-2">
            <TabsTrigger value="creators">Top Creators</TabsTrigger>
            <TabsTrigger value="winners">Recent Winners</TabsTrigger>
          </TabsList>

          <TabsContent value="creators" className="space-y-6">
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-4">
              {topCreators.slice(0, 3).map((user, index) => (
                <Card
                  key={user.address}
                  className={`${
                    index === 0
                      ? 'md:order-2 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100'
                      : index === 1
                      ? 'md:order-1 border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
                      : 'md:order-3 border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100'
                  }`}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="text-5xl mb-3">{getMedalEmoji(index)}</div>
                    
                    <Identity
                      address={user.address as `0x${string}`}
                      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                    >
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <Avatar className="w-16 h-16" />
                        <div className="text-center">
                          <Name className="text-lg font-bold text-black" />
                          <Address className="text-xs text-gray-500" />
                        </div>
                      </div>
                    </Identity>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="font-bold text-black">{user.nftsOwned}</div>
                        <div className="text-xs text-gray-600">NFTs</div>
                      </div>
                      <div>
                        <div className="font-bold text-black">{user.totalUpvotes}</div>
                        <div className="text-xs text-gray-600">Upvotes</div>
                      </div>
                      <div>
                        <div className="font-bold text-black">{user.rafflesWon}</div>
                        <div className="text-xs text-gray-600">Wins</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rest of Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCreators.map((user, index) => (
                    <div
                      key={user.address}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index < 3 ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="w-12 text-center">
                        <div className="text-2xl font-bold text-black">
                          {getMedalEmoji(index)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <Identity
                          address={user.address as `0x${string}`}
                          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10" />
                            <div className="flex-1 min-w-0">
                              <Name className="text-base font-semibold text-black" />
                              <Address className="text-xs text-gray-500" />
                            </div>
                          </div>
                        </Identity>
                      </div>

                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-black">{user.nftsOwned}</div>
                          <div className="text-xs text-gray-600">NFTs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-black">{user.totalUpvotes}</div>
                          <div className="text-xs text-gray-600">Upvotes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-black">{user.rafflesWon}</div>
                          <div className="text-xs text-gray-600">Wins</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Recent Raffle Winners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWinners.map((user, index) => (
                    <Card key={user.address} className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-purple-600 text-white">
                            Round #{5 - index}
                          </Badge>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Winner
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-3xl">🏆</div>
                          
                          <div className="flex-1">
                            <Identity
                              address={user.address as `0x${string}`}
                              schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12" />
                                <div className="flex-1 min-w-0">
                                  <Name className="text-lg font-bold text-black" />
                                  <Address className="text-sm text-gray-500" />
                                </div>
                              </div>
                            </Identity>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-black">$500</div>
                            <div className="text-xs text-gray-600">Prize</div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                          <div className="bg-white/50 rounded p-2">
                            <div className="font-bold text-black">{user.nftsOwned}</div>
                            <div className="text-xs text-gray-600">Total NFTs</div>
                          </div>
                          <div className="bg-white/50 rounded p-2">
                            <div className="font-bold text-black">{user.totalUpvotes}</div>
                            <div className="text-xs text-gray-600">Upvotes</div>
                          </div>
                          <div className="bg-white/50 rounded p-2">
                            <div className="font-bold text-black">{user.rafflesWon}</div>
                            <div className="text-xs text-gray-600">Total Wins</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Basenames Info & Examples */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏷️</div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Basenames Identity
                </h3>
                <p className="text-gray-700 mb-3">
                  Basenames provides human-readable identities on Base. Users with 
                  Basenames (like alice.base) are displayed throughout the app for 
                  easy recognition and social credibility.
                </p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>✓ Easy to remember</span>
                  <span>✓ Onchain identity</span>
                  <span>✓ Social recognition</span>
                </div>
              </div>
            </div>

            {/* Example Basenames Preview */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-black mb-4">Example Basenames Preview</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {topCreators.slice(0, 4).map((user) => (
                  <div key={user.address} className="bg-white rounded-lg p-4 border border-gray-200">
                    <Identity
                      address={user.address as `0x${string}`}
                      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12" />
                        <div className="flex-1 min-w-0">
                          <Name className="text-base font-semibold text-black block mb-1" />
                          <Address className="text-xs text-gray-500" />
                        </div>
                      </div>
                    </Identity>
                    {user.basename && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          {user.basename}
                        </Badge>
                        <span className="text-gray-500">← Basename</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                These are live examples showing how Basenames appear in the app
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
