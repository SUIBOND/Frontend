import Navbar from "@/components/common/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <Component {...pageProps} />
            </div>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </>
  );
}
