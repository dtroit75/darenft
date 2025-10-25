# Base-Powered Web3 Raffle dApp

A fully functional decentralized raffle dApp deployed on Base, integrating OnchainKit, Basenames, and Chainlink VRF for verifiable randomness.

## 🌟 Features

### Core Functionality
- **NFT Minting**: Users mint ERC-721 NFTs representing their fan stories or collectibles
- **Automatic Raffle Entry**: Each minted NFT becomes an automatic raffle entry
- **Upvoting System**: Users can upvote NFTs, increasing their raffle weight
- **Verifiable Randomness**: Chainlink VRF ensures fair winner selection
- **Prize Distribution**: Winners claim prizes directly in the dApp
- **Identity Integration**: Basenames (username.base) for social recognition

### Technology Stack
- **Blockchain**: Base (Layer 2 Ethereum)
- **Smart Contracts**: Solidity + Hardhat
- **Randomness**: Chainlink VRF
- **Frontend**: Next.js + Tailwind CSS + OnchainKit
- **Identity**: Basenames
- **Storage**: IPFS (via Pinata)
- **Hosting**: Vercel

## 📁 Project Structure

```
/
├── contracts/              # Solidity smart contracts
│   ├── RaffleNFT.sol      # ERC-721 with minting & upvoting
│   ├── RaffleManager.sol  # Chainlink VRF integration
│   └── DAREToken.sol      # ERC-20 utility token
├── src/
│   ├── app/
│   │   ├── page.tsx       # Home page
│   │   ├── mint/          # NFT minting interface
│   │   ├── gallery/       # NFT gallery with upvoting
│   │   ├── raffle/        # Raffle management dashboard
│   │   └── leaderboard/   # Top creators & winners
│   ├── components/
│   │   ├── NavBar.tsx     # Navigation with wallet
│   │   └── NFTCard.tsx    # NFT display component
│   └── lib/
│       ├── contracts.ts   # Contract ABIs & addresses
│       └── ipfs.ts        # IPFS utilities
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or Coinbase Wallet
- Base Sepolia testnet ETH (get from [Base Faucet](https://www.base.org/faucet))

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd base-raffle-dapp
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
```
http://localhost:3000
```

## 📝 Smart Contract Deployment

### Deploy to Base Sepolia

1. **Install Hardhat**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Create Hardhat Config**

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532
    }
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY
    }
  }
};
```

3. **Create Deployment Script**

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  // Deploy RaffleNFT
  console.log("Deploying RaffleNFT...");
  const RaffleNFT = await hre.ethers.getContractFactory("RaffleNFT");
  const raffleNFT = await RaffleNFT.deploy();
  await raffleNFT.waitForDeployment();
  console.log("RaffleNFT deployed to:", await raffleNFT.getAddress());

  // Deploy DAREToken
  console.log("Deploying DAREToken...");
  const DAREToken = await hre.ethers.getContractFactory("DAREToken");
  const dareToken = await DAREToken.deploy();
  await dareToken.waitForDeployment();
  console.log("DAREToken deployed to:", await dareToken.getAddress());

  // Chainlink VRF Coordinator on Base Sepolia
  const vrfCoordinator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
  const subscriptionId = 0; // Replace with your VRF subscription ID
  const keyHash = "0x..."; // Replace with Base Sepolia key hash

  // Deploy RaffleManager
  console.log("Deploying RaffleManager...");
  const RaffleManager = await hre.ethers.getContractFactory("RaffleManager");
  const raffleManager = await RaffleManager.deploy(
    vrfCoordinator,
    subscriptionId,
    keyHash,
    await raffleNFT.getAddress()
  );
  await raffleManager.waitForDeployment();
  console.log("RaffleManager deployed to:", await raffleManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. **Deploy**
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

5. **Verify Contracts**
```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### Update Contract Addresses

After deployment, update `src/lib/contracts.ts` with your deployed contract addresses:

```typescript
export const CONTRACTS = {
  RAFFLE_NFT: '0xYOUR_RAFFLE_NFT_ADDRESS' as `0x${string}`,
  RAFFLE_MANAGER: '0xYOUR_RAFFLE_MANAGER_ADDRESS' as `0x${string}`,
  DARE_TOKEN: '0xYOUR_DARE_TOKEN_ADDRESS' as `0x${string}`,
  // ...
};
```

## 🔗 Chainlink VRF Setup

1. **Get LINK Tokens**
   - Get testnet LINK from [Chainlink Faucet](https://faucets.chain.link/)

2. **Create VRF Subscription**
   - Visit [Chainlink VRF](https://vrf.chain.link/)
   - Create a new subscription on Base Sepolia
   - Add your RaffleManager contract as a consumer
   - Fund with LINK tokens

3. **Update Configuration**
   - Update subscription ID in deployment script
   - Use Base Sepolia VRF key hash

## 💡 Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" in the navigation
   - Sign in with MetaMask or Coinbase Wallet

2. **Mint an NFT**
   - Go to "Mint NFT" page
   - Enter name and story
   - Upload an image
   - Click "Upload Metadata" then "Mint NFT"

3. **Browse Gallery**
   - View all minted NFTs
   - Upvote your favorites
   - More upvotes = higher winning chances

4. **Check Leaderboard**
   - See top creators
   - View recent winners
   - Basenames displayed for identity

### For Admins

1. **Create Raffle**
   - Deploy contracts
   - Call `createRaffle(duration)` with duration in seconds

2. **Draw Winner**
   - Wait for raffle to end
   - Go to "Raffle" page
   - Click "Draw Winner with VRF"
   - Chainlink VRF selects winner based on weights

3. **Fund Prize Pool**
   - Send ETH to RaffleManager contract
   - Winners can claim prizes

## 🎨 Customization

### Theme Colors
The app uses Base theme from OnchainKit:
- Background: `rgb(0, 0, 0)`
- Text: `rgb(255, 255, 255)`
- Accent: `rgb(129, 140, 248)`

### IPFS Configuration
Update `src/lib/ipfs.ts` to use your Pinata credentials:

```typescript
const PINATA_API_KEY = 'YOUR_API_KEY';
const PINATA_SECRET_KEY = 'YOUR_SECRET_KEY';
```

## 📚 Key Concepts

### Weighted Raffle System
- Each NFT has base weight of 1
- Each upvote adds +1 to weight
- NFT with 10 upvotes has 11x higher chance than NFT with 0 upvotes
- Chainlink VRF ensures fair random selection based on weights

### Chainlink VRF Flow
1. Admin calls `drawWinner(raffleId)`
2. Contract requests random number from Chainlink VRF
3. VRF generates verifiable random value
4. `fulfillRandomWords` callback selects winner
5. Winner address and token ID stored onchain

### Basenames Integration
- OnchainKit automatically resolves Basenames
- Displays username.base instead of 0x addresses
- Enhances social recognition and trust

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing Locally
1. Use Hardhat local network
2. Deploy contracts locally
3. Update contract addresses
4. Connect MetaMask to localhost

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Contracts (Base Mainnet)
1. Get Base mainnet ETH
2. Update network to Base mainnet
3. Deploy contracts
4. Verify on BaseScan

## 📖 Resources

- [Base Documentation](https://docs.base.org)
- [OnchainKit Docs](https://onchainkit.xyz)
- [Chainlink VRF](https://docs.chain.link/vrf)
- [Basenames](https://www.base.org/names)
- [IPFS Documentation](https://docs.ipfs.tech)

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with OnchainKit SDK v0.38.17 by Modu on Ohara

- Base Network Team
- Chainlink VRF
- OnchainKit by Coinbase
- The Base community

---

**Need help?** Join the [Base Discord](https://discord.gg/base) or check out the [Base Forum](https://forum.base.org)
