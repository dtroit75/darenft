import type { NFTMetadata } from '@/app/types/raffle';

// IPFS gateway for storing NFT metadata
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export interface UploadToIPFSResult {
  ipfsHash: string;
  tokenURI: string;
}

/**
 * Upload NFT metadata to IPFS via Pinata
 * Note: In production, you'd use Pinata API keys
 */
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<UploadToIPFSResult> {
  try {
    // In a production app, you would use actual Pinata credentials
    // For this demo, we'll simulate the upload
    const mockIPFSHash = generateMockIPFSHash(metadata.name);
    
    return {
      ipfsHash: mockIPFSHash,
      tokenURI: `${IPFS_GATEWAY}${mockIPFSHash}`,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Upload image file to IPFS
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    // In production, upload to Pinata or other IPFS service
    // For demo, we'll use a data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // In production, this would be an actual IPFS hash
        const mockHash = generateMockIPFSHash(file.name);
        resolve(`${IPFS_GATEWAY}${mockHash}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchMetadataFromIPFS(tokenURI: string): Promise<NFTMetadata> {
  try {
    const response = await fetch(tokenURI);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    return await response.json() as NFTMetadata;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch metadata from IPFS');
  }
}

/**
 * Create NFT metadata object
 */
export function createNFTMetadata(
  name: string,
  description: string,
  imageUrl: string,
  attributes: Array<{ trait_type: string; value: string }>
): NFTMetadata {
  return {
    name,
    description,
    image: imageUrl,
    attributes,
  };
}

/**
 * Generate mock IPFS hash for demo purposes
 */
function generateMockIPFSHash(seed: string): string {
  const hash = Array.from(seed)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16);
  return `Qm${hash}${'x'.repeat(44 - hash.length)}`;
}

/**
 * Validate IPFS URL
 */
export function isValidIPFSUrl(url: string): boolean {
  return url.startsWith('ipfs://') || url.startsWith(IPFS_GATEWAY);
}

/**
 * Convert IPFS URL to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUrl: string): string {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', IPFS_GATEWAY);
  }
  return ipfsUrl;
}
