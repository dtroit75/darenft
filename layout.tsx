import type { Metadata } from 'next'
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import FarcasterWrapper from "@/components/FarcasterWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body>
            <Providers>
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      </Providers>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "Web3 Raffle dApp",
        description: "Create a decentralized raffle on Base using Chainlink VRF for fair winner selection, NFT minting for entries, and upvoting for added weight. Integrated with OnchainKit and Basenames.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_17345bba-543d-4197-8fee-0adc9997d9bf-gW0neDbmgz2eFap0jyNzOz5ULFVnea","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Web3 Raffle dApp","url":"https://studied-labor-980.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
