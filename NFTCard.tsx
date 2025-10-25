'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RaffleNFT } from '@/app/types/raffle';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { CONTRACTS, RAFFLE_NFT_ABI } from '@/lib/contracts';
import { base } from 'wagmi/chains';
import { useAccount } from 'wagmi';

interface NFTCardProps {
  nft: RaffleNFT;
  onUpvoted?: () => void;
}

export function NFTCard({ nft, onUpvoted }: NFTCardProps): JSX.Element {
  const { address } = useAccount();
  const [showUpvoteTransaction, setShowUpvoteTransaction] = useState<boolean>(false);

  const calls = [
    {
      address: CONTRACTS.RAFFLE_NFT,
      abi: RAFFLE_NFT_ABI,
      functionName: 'upvoteNFT',
      args: [BigInt(nft.tokenId)],
    },
  ];

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('Upvote transaction status:', status);
    if (status.statusName === 'success') {
      setShowUpvoteTransaction(false);
      onUpvoted?.();
    }
  }, [onUpvoted]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={nft.imageUrl || '/placeholder-nft.png'}
          alt={nft.metadata.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-black backdrop-blur-sm">
            #{nft.tokenId}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-black mb-1">
            {nft.metadata.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {nft.story}
          </p>
        </div>

        {/* Owner Info with Basename */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500 mb-2">Owner</p>
          <Identity
            address={nft.owner as `0x${string}`}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6" />
              <div className="flex-1 min-w-0">
                <Name className="text-sm font-medium text-black" />
                <Address className="text-xs text-gray-500" />
              </div>
            </div>
          </Identity>
        </div>

        {/* Upvotes */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👍</span>
            <div>
              <div className="text-lg font-bold text-black">
                {nft.upvotes}
              </div>
              <div className="text-xs text-gray-500">Upvotes</div>
            </div>
          </div>

          {address && address !== nft.owner ? (
            !showUpvoteTransaction ? (
              <Button
                onClick={() => setShowUpvoteTransaction(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Upvote
              </Button>
            ) : (
              <div className="flex-1">
                <Transaction
                  chainId={base.id}
                  calls={calls}
                  onStatus={handleOnStatus}
                >
                  <TransactionButton className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2" />
                  <TransactionStatus>
                    <TransactionStatusLabel />
                  </TransactionStatus>
                </Transaction>
              </div>
            )
          ) : address === nft.owner ? (
            <Badge variant="outline" className="text-gray-500">
              Your NFT
            </Badge>
          ) : null}
        </div>

        {/* Attributes */}
        {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex flex-wrap gap-2">
              {nft.metadata.attributes.map((attr, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
