export type BlockchainType = "bitcoin" | "stacks" | "solana";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  error: string | null;
}

export interface WalletStore {
  bitcoin: WalletState;
  stacks: WalletState;
  solana: WalletState;
  connectWallet: (blockchain: BlockchainType) => Promise<void>;
  disconnectWallet: (blockchain: BlockchainType) => void;
  setError: (blockchain: BlockchainType, error: string) => void;
  clearError: (blockchain: BlockchainType) => void;
  transfer: (
    blockchain: BlockchainType,
    address: string,
    amount: number,
  ) => Promise<void>;
}

export interface BitcoinTransfer {
  amount: string;
  destinationAddress: string;
  isProcessing: boolean;
  error: string | null;
}
