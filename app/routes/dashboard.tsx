import { BitcoinTransfer } from "../components/BitcoinTransfer";
import { WalletConnect } from "../components/WalletConnect";
import { useWalletStore } from "../store/useWalletStore";

const Dashboard = () => {
  const { bitcoin: bitcoinWallet } = useWalletStore();

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Blockchain Wallet Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Connect and manage multiple blockchain wallets seamlessly
          </p>
        </header>

        {/* Wallet Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <WalletConnect
            type="bitcoin"
            className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 backdrop-blur-sm"
            icon="bitcoin-icon"
          />
          <WalletConnect
            type="stacks"
            className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 backdrop-blur-sm"
            icon="stacks-icon"
          />
          <WalletConnect
            type="solana"
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm"
            icon="solana-icon"
          />
        </div>

        {/* Transfer Section */}
        {bitcoinWallet.isConnected && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
              Bitcoin Transfer
            </h2>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
              <BitcoinTransfer />
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
      </div>
    </div>
  );
};

export default Dashboard;
