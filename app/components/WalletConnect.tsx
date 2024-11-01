import { useWalletStore } from "../store/useWalletStore";
import { BlockchainType } from "../types/wallet";

interface WalletConnectProps {
  blockchain: BlockchainType;
}

export const WalletConnect = ({
  blockchain,
}: WalletConnectProps): JSX.Element => {
  const {
    [blockchain]: walletState,
    connectWallet,
    disconnectWallet,
  } = useWalletStore();

  const handleConnect = async () => {
    await connectWallet(blockchain);
  };

  const handleDisconnect = () => {
    disconnectWallet(blockchain);
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{blockchain}</h2>
        <button
          onClick={walletState.isConnected ? handleDisconnect : handleConnect}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            walletState.isConnected
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          aria-label={`${
            walletState.isConnected ? "Disconnect" : "Connect"
          } ${blockchain} wallet`}
        >
          {walletState.isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>

      {walletState.isConnected && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Address: {walletState.address}
          </p>
          {walletState.balance && (
            <p className="text-sm text-gray-600">
              Balance: {walletState.balance} {blockchain.toUpperCase()}
            </p>
          )}
        </div>
      )}

      {walletState.error && (
        <p className="mt-2 text-sm text-red-500">{walletState.error}</p>
      )}
    </div>
  );
};
