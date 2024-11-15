import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Navbar() {
  const currentAccount = useCurrentAccount();

  return (
    <header className="p-4 bg-blue-500">
      <nav className="container flex items-center justify-end gap-4 mx-auto text-white">
        {currentAccount && (
          <div className="space-x-6">
            <Link href="/all-bounties" className="hover:text-blue-100">
              All bounties
            </Link>
            <Link href="/profile" className="hover:text-blue-100">
              My Profile
            </Link>
          </div>
        )}
        <ConnectButton />
      </nav>
    </header>
  );
}
