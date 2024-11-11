import { useState, useEffect } from "react";
import { useConnectWallet, useWallets } from "@mysten/dapp-kit";

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState("");
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();

  useEffect(() => {
    // Load wallet address from local storage on initial load
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }

    // Update the wallet address if a wallet is connected and has accounts
    if (wallets.length > 0 && wallets[0].accounts?.length > 0) {
      setWalletAddress(wallets[0].accounts[0].address);
      localStorage.setItem("walletAddress", wallets[0].accounts[0].address); // Persist in local storage
    }
  }, [wallets]);

  const handleConnectWallet = async () => {
    if (wallets.length > 0) {
      try {
        connect(
          { wallet: wallets[0] },
          {
            onSuccess: () => {
              if (wallets[0].accounts?.length > 0) {
                const address = wallets[0].accounts[0].address;
                setWalletAddress(address); // Set the wallet address on success
                localStorage.setItem("walletAddress", address); // Save to local storage
              }
              console.log("Wallet connected");
            },
            onError: (error) => {
              console.error("Failed to connect wallet:", error);
            },
          }
        );
      } catch (error) {
        console.error("Connection rejected or failed:", error);
      }
    }
  };

  return (
    <header className="p-4 bg-blue-500">
      <nav className="container flex items-center justify-end gap-4 mx-auto text-white">
        {walletAddress ? (
          <>
            <div className="space-x-6">
              <a href="/all-bounties" className="hover:text-blue-100">
                All bounties
              </a>
              <a href="/profile" className="hover:text-blue-100">
                My Profile
              </a>
            </div>
            <div className="px-4 py-2 bg-blue-400 rounded-lg">
              <span>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>{" "}
              {/* Display shortened wallet address */}
            </div>
          </>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="px-4 py-2 bg-blue-400 rounded-lg hover:text-blue-100"
          >
            Connect Wallet
          </button>
        )}
      </nav>
    </header>
  );
}
