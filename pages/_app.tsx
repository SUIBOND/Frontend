import Navbar from "@/components/common/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@mysten/dapp-kit/dist/index.css';
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { networkConfig } = createNetworkConfig({
  suiscan_testnet: { url: "https://rpc-testnet.suiscan.xyz:443" },
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="suiscan_testnet">
          <WalletProvider autoConnect>
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
