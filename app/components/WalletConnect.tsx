import * as React from "react";
import { useWalletStore } from "../store/useWalletStore";

interface WalletConnectProps {
  type: "bitcoin" | "stacks" | "solana";
  isConnected: boolean;
  className?: string;
  icon: string;
  balance?: string;
  address?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  type,
  isConnected,
  className,
  icon,
  balance = "0",
  address = "",
}) => {
  const { connectWallet, disconnectWallet } = useWalletStore();

  const handleConnect = async () => {
    try {
      await connectWallet(type);
    } catch (error) {
      console.error(`Failed to connect ${type} wallet:`, error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet(type);
    } catch (error) {
      console.error(`Failed to disconnect ${type} wallet:`, error);
    }
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 3)}...${addr.slice(-3)}`;
  };

  return (
    <div
      className={`
        relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02]
        border border-white/10 shadow-lg
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <img
              src={`/icons/${icon}.svg`}
              alt={`${type} icon`}
              className="w-8 h-8"
            />
          </div>
          <h3 className="text-2xl font-semibold capitalize">{type}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`
            text-sm ${isConnected ? "text-green-400" : "text-gray-400"}
          `}
          >
            {isConnected ? "Connected" : "Not Connected"}
          </span>
          <div
            className={`
              h-3 w-3 rounded-full
              ${isConnected ? "bg-green-400" : "bg-gray-400"}
            `}
          />
        </div>
      </div>

      {isConnected && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm">Balance:</span>
            <span className="text-white font-medium">{balance}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm">Address:</span>
            <span className="text-white font-medium">
              {truncateAddress(address)}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        className={`
          w-full py-3 px-6 rounded-xl font-medium transition-all duration-300
          flex items-center justify-center space-x-2
          ${
            isConnected
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
              : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
          }
        `}
        aria-label={`${isConnected ? "Disconnect" : "Connect"} ${type} wallet`}
      >
        <span>{isConnected ? "Disconnect" : "Connect"} Wallet</span>
      </button>
    </div>
  );
};
