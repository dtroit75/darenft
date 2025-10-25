'use client';

import { useState, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { CONTRACTS, RAFFLE_MANAGER_ABI } from '@/lib/contracts';
import { base } from 'wagmi/chains';
import type { RaffleRound } from '@/app/types/raffle';

// Mock current raffle data
const mockCurrentRaffle: RaffleRound = {
  id: '5',
  startTime: Date.now() - 3600000, // 1 hour ago
  endTime: Date.now() + 86400000, // 24 hours from now
  status: 'active',
  totalEntries: 156,
};

const mockPastRaffles: RaffleRound[] = [
  {
    id: '4',
    startTime: Date.now() - 691200000,
    endTime: Date.now() - 604800000,
    status: 'completed',
    winner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    totalEntries: 142,
    vrfRequestId: '0x1234...5678',
  },
  {
    id: '3',
    startTime: Date.now() - 1296000000,
    endTime: Date.now() - 1209600000,
    status: 'completed',
    winner: '0x83c61A2f34C8F4b77E8f8E65b5e7D0e82F9F8c8a',
    totalEntries: 128,
    vrfRequestId: '0xabcd...ef01',
  },
];

export default function RafflePage(): JSX.Element {
  const { address, isConnected } = useAccount();
  const [currentRaffle] = useState<RaffleRound>(mockCurrentRaffle);
  const [pastRaffles] = useState<RaffleRound[]>(mockPastRaffles);
  const [showDrawTransaction, setShowDrawTransaction] = useState<boolean>(false);

  const isAdmin = true; // In production, check if connected address is admin

  const timeUntilEnd = currentRaffle.endTime - Date.now();
  const hours = Math.floor(timeUntilEnd / 3600000);
  const minutes = Math.floor((timeUntilEnd % 3600000) / 60000);

  const calls = [
    {
      address: CONTRACTS.RAFFLE_MANAGER,
      abi: RAFFLE_MANAGER_ABI,
      functionName: 'drawWinner',
      args: [BigInt(currentRaffle.id)],
    },
  ];

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('Draw winner status:', status);
    if (status.statusName === 'success') {
      setShowDrawTransaction(false);
      alert('Winner drawn successfully! Check the leaderboard for results.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Raffle Dashboard</h1>
          <p className="text-gray-600">
            Manage raffle rounds and draw winners using Chainlink VRF
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Raffle */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-black">Current Raffle Round</CardTitle>
                  <Badge className="bg-green-500 text-white">
                    {currentRaffle.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-black">
                      #{currentRaffle.id}
                    </div>
                    <div className="text-sm text-gray-600">Round ID</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-black">
                      {currentRaffle.totalEntries}
                    </div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-black">
                      {hours}h {minutes}m
                    </div>
                    <div className="text-sm text-gray-600">Time Left</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-black mb-3">Raffle Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Time:</span>
                      <span className="text-black font-medium">
                        {new Date(currentRaffle.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Time:</span>
                      <span className="text-black font-medium">
                        {new Date(currentRaffle.endTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="font-semibold text-black mb-1">
                        Chainlink VRF Integration
                      </h4>
                      <p className="text-sm text-gray-700">
                        This raffle uses Chainlink VRF (Verifiable Random Function) 
                        to ensure fair and transparent winner selection. The randomness 
                        is cryptographically provable and cannot be manipulated.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Draw Winner */}
            {isAdmin && isConnected && (
              <Card className="border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-black">Admin Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {timeUntilEnd > 0 ? (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-3">⏳</div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Raffle In Progress
                      </h3>
                      <p className="text-gray-600 mb-4">
                        The raffle is currently active. Come back after the end time to draw the winner.
                      </p>
                      <div className="text-2xl font-bold text-black">
                        {hours}h {minutes}m remaining
                      </div>
                    </div>
                  ) : !showDrawTransaction ? (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-3">🎲</div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Ready to Draw Winner
                      </h3>
                      <p className="text-gray-600 mb-4">
                        The raffle has ended. Click below to initiate Chainlink VRF 
                        and select a winner based on weighted probabilities.
                      </p>
                      <Button
                        onClick={() => setShowDrawTransaction(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                      >
                        Draw Winner with VRF
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Transaction
                        chainId={base.id}
                        calls={calls}
                        onStatus={handleOnStatus}
                      >
                        <TransactionButton className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg" />
                        <TransactionSponsor />
                        <TransactionStatus>
                          <TransactionStatusLabel />
                          <TransactionStatusAction />
                        </TransactionStatus>
                      </Transaction>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold text-black mb-2">How it works:</h4>
                        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                          <li>Transaction requests random number from Chainlink VRF</li>
                          <li>VRF generates verifiable random value</li>
                          <li>Winner selected based on weighted probabilities</li>
                          <li>Result emitted as WinnerSelected event</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Past Raffles */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Past Raffles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastRaffles.map((raffle) => (
                  <Card key={raffle.id} className="bg-gray-50">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-black">
                          Round #{raffle.id}
                        </div>
                        <Badge variant="outline" className="bg-gray-200 text-gray-700">
                          Completed
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div>Entries: {raffle.totalEntries}</div>
                        <div className="break-all text-xs mt-1">
                          VRF: {raffle.vrfRequestId}
                        </div>
                      </div>

                      {raffle.winner && (
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-500 mb-2">Winner</p>
                          <Identity
                            address={raffle.winner as `0x${string}`}
                            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5" />
                              <div className="flex-1 min-w-0">
                                <Name className="text-sm font-medium text-black" />
                                <Address className="text-xs text-gray-500" />
                              </div>
                            </div>
                          </Identity>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                About Chainlink VRF
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-black mb-2">Verifiable Randomness</h4>
                  <p>
                    Chainlink VRF provides cryptographic proof that the random number 
                    is truly random and hasn't been tampered with. Anyone can verify 
                    the randomness onchain.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">Weighted Selection</h4>
                  <p>
                    NFTs with more upvotes have proportionally higher chances of winning. 
                    The VRF random number is used to fairly select based on these weights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <span>🏷️</span>
                Raffle Entries with Basenames
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Winners are displayed with their Basenames for easy recognition. 
                Here are examples of past raffle participants:
              </p>
              <div className="space-y-3">
                {pastRaffles.slice(0, 2).filter(raffle => raffle.winner).map((raffle) => (
                    <div key={raffle.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">Round #{raffle.id}</Badge>
                        <span className="text-xl">🏆</span>
                      </div>
                      <Identity
                        address={raffle.winner as `0x${string}`}
                        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8" />
                          <div className="flex-1 min-w-0">
                            <Name className="text-sm font-semibold text-black block" />
                            <Address className="text-xs text-gray-500" />
                          </div>
                        </div>
                      </Identity>
                    </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4 text-center">
                Live examples of Basenames in raffle results
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
