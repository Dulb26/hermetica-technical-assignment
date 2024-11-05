import { PhantomBitcoinProvider } from "../services/wallets/types";

declare global {
  interface Window {
    phantom?: {
      bitcoin?: PhantomBitcoinProvider;
      solana?: {
        isPhantom?: boolean;
        isSolflare?: boolean;
        connect(): Promise<{ publicKey: { toString(): string } }>;
        disconnect(): Promise<void>;
        signTransaction(transaction: Transaction): Promise<Transaction>;
        signAllTransactions(
          transactions: Transaction[],
        ): Promise<Transaction[]>;
        signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
      };
    };
  }
}

export {};
