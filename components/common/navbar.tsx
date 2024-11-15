import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const [dashboardUrl, setDashboardUrl] = useState("/dashboard");

  useEffect(() => {
    // Check localStorage for foundation_ids or developer_ids
    const foundationIds = localStorage.getItem("foundation_ids");
    const developerIds = localStorage.getItem("developerCapId");

    if (foundationIds) {
      setDashboardUrl("/foundation/dashboard");
    } else if (developerIds) {
      setDashboardUrl("/developer/dashboard");
    }
  }, []);

  const handleDashboardRedirect = () => {
    router.push(dashboardUrl);
  };

  return (
    <header className="p-4 bg-blue-500">
      <nav className="container flex items-center justify-end gap-4 mx-auto text-white">
        {currentAccount && (
          <div className="space-x-6">
            <Link href="/all-bounties" className="hover:text-blue-100">
              All bounties
            </Link>
            <button
              onClick={handleDashboardRedirect}
              className="hover:text-blue-100"
            >
              Dashboard
            </button>
          </div>
        )}
        <ConnectButton />
      </nav>
    </header>
  );
}
