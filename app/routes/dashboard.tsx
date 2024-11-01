import { BitcoinTransfer, WalletConnect } from "../components";
import { usePageEffect } from "../core/page";

export const Component = function Dashboard(): JSX.Element {
  usePageEffect({ title: "Dashboard" });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Blockchain Wallet Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <WalletConnect blockchain="bitcoin" />
          <WalletConnect blockchain="stacks" />
          <WalletConnect blockchain="solana" />
        </div>

        <div className="mt-8">
          <BitcoinTransfer />
        </div>
      </div>
    </div>
  );
};
