import * as React from "react";
import { useWalletStore } from "../store/useWalletStore";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast from "react-hot-toast";

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
      toast.success(`Successfully connected ${type} wallet`);
    } catch (error) {
      console.error(`Failed to connect ${type} wallet:`, error);
      toast.error(`Failed to connect ${type} wallet. Please try again.`);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet(type);
      toast.success(`Successfully disconnected ${type} wallet`);
    } catch (error) {
      console.error(`Failed to disconnect ${type} wallet:`, error);
      toast.error(`Failed to disconnect ${type} wallet. Please try again.`);
    }
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 3)}...${addr.slice(-3)}`;
  };

  return (
    <Tooltip.Provider delayDuration={200}>
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
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className="text-white font-medium cursor-help">
                    {balance}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded-md bg-gray-900 px-4 py-2.5 text-sm text-gray-100 shadow-md"
                    sideOffset={5}
                  >
                    Current {type} balance
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-sm">Address:</span>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className="text-white font-medium cursor-help">
                    {truncateAddress(address)}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded-md bg-gray-900 px-4 py-2.5 text-sm text-gray-100 shadow-md"
                    sideOffset={5}
                  >
                    Full address: {address}
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </div>
        )}

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
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
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="rounded-md bg-gray-900 px-4 py-2.5 text-sm text-gray-100 shadow-md"
              sideOffset={5}
            >
              {isConnected
                ? `Disconnect your ${type} wallet`
                : `Connect your ${type} wallet ${type === "bitcoin" ? "to enable transfers" : "to continue"}`}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
};
