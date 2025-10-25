'use client';

import { useState, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { useAccount } from 'wagmi';
import { CONTRACTS, RAFFLE_NFT_ABI } from '@/lib/contracts';
import { uploadMetadataToIPFS, uploadImageToIPFS, createNFTMetadata } from '@/lib/ipfs';
import { base } from 'wagmi/chains';

export default function MintPage(): JSX.Element {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [tokenURI, setTokenURI] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMetadata = async (): Promise<void> => {
    if (!name || !story || !imageFile) {
      alert('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    try {
      // Upload image to IPFS
      const imageUrl = await uploadImageToIPFS(imageFile);

      // Create metadata
      const metadata = createNFTMetadata(
        name,
        story,
        imageUrl,
        [
          { trait_type: 'Story Type', value: 'Fan Story' },
          { trait_type: 'Creator', value: address || 'Unknown' },
        ]
      );

      // Upload metadata to IPFS
      const { tokenURI: uri } = await uploadMetadataToIPFS(metadata);
      setTokenURI(uri);
      
      alert('Metadata uploaded successfully! Now you can mint your NFT.');
    } catch (error) {
      console.error('Error uploading metadata:', error);
      alert('Failed to upload metadata. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const calls = tokenURI
    ? [
        {
          address: CONTRACTS.RAFFLE_NFT,
          abi: RAFFLE_NFT_ABI,
          functionName: 'mintNFT',
          args: [story, tokenURI],
        },
      ]
    : [];

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('Transaction status:', status);
    if (status.statusName === 'success') {
      // Reset form
      setName('');
      setStory('');
      setImageFile(null);
      setImagePreview('');
      setTokenURI('');
      alert('NFT minted successfully! Check the gallery to see your NFT.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Mint Your NFT</h1>
          <p className="text-gray-600">
            Create an NFT with your story or collectible. Each minted NFT becomes an automatic raffle entry!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-black">NFT Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-black">NFT Name</Label>
                <Input
                  id="name"
                  placeholder="Enter NFT name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="story" className="text-black">Your Story</Label>
                <Textarea
                  id="story"
                  placeholder="Share your fan story or describe your collectible..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="mt-2 min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-black">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2"
                />
              </div>

              {imagePreview && (
                <div>
                  <Label className="text-black">Preview</Label>
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUploadMetadata}
                disabled={isUploading || !name || !story || !imageFile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? 'Uploading to IPFS...' : 'Upload Metadata'}
              </Button>
            </CardContent>
          </Card>

          {/* Mint Transaction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Mint Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    Connect your wallet to mint NFTs
                  </p>
                </div>
              ) : !tokenURI ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    Upload your metadata first to enable minting
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>✓ Fill in NFT name</p>
                    <p>✓ Write your story</p>
                    <p>✓ Upload an image</p>
                    <p>✓ Click Upload Metadata</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      Metadata uploaded successfully!
                    </p>
                    <p className="text-xs text-green-700 break-all">
                      {tokenURI}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Transaction
                      chainId={base.id}
                      calls={calls}
                      onStatus={handleOnStatus}
                    >
                      <TransactionButton className="w-full bg-purple-600 hover:bg-purple-700 text-white" />
                      <TransactionSponsor />
                      <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                      </TransactionStatus>
                    </Transaction>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-black mb-2">What happens next?</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Your NFT will be minted on Base</li>
                      <li>• It becomes a raffle entry automatically</li>
                      <li>• Others can upvote your NFT</li>
                      <li>• More upvotes = higher winning chance</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🎟️</div>
                <h3 className="font-semibold text-black mb-1">Automatic Entry</h3>
                <p className="text-sm text-gray-600">
                  Every minted NFT is automatically entered into the current raffle
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">👍</div>
                <h3 className="font-semibold text-black mb-1">Upvote Weight</h3>
                <p className="text-sm text-gray-600">
                  More upvotes increase your NFT raffle weight for better odds
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔗</div>
                <h3 className="font-semibold text-black mb-1">IPFS Storage</h3>
                <p className="text-sm text-gray-600">
                  Your NFT metadata is stored on IPFS for permanence
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
