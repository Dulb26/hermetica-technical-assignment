import { create } from "zustand";
import bitcoinService from "../services/bitcoinService";
import { stacksService } from "../services/stacksService";
import { BlockchainType, WalletStore } from "../types/wallet";

export const useWalletStore = create<WalletStore>((set) => ({
  bitcoin: {
    isConnected: false,
    address: null,
    balance: null,
    error: null,
  },
  stacks: {
    isConnected: false,
    address: null,
    balance: null,
    error: null,
  },
  solana: {
    isConnected: false,
    address: null,
    balance: null,
    error: null,
  },
  connectWallet: async (blockchain: BlockchainType) => {
    try {
      if (blockchain === "stacks") {
        const { address } = await stacksService.connect();
        const balance = await stacksService.getBalance(address);

        set((state) => ({
          stacks: {
            ...state.stacks,
            isConnected: true,
            address,
            balance,
            error: null,
          },
        }));
      } else if (blockchain === "bitcoin") {
        const { address } = await bitcoinService.connect();
        let balance = "0";

        try {
          balance = await bitcoinService.getBalance(address);
        } catch (error) {
          console.warn("Failed to fetch balance:", error);
        }

        set((state) => ({
          bitcoin: {
            ...state.bitcoin,
            isConnected: true,
            address,
            balance,
            error: null,
          },
        }));
      } else {
        // Implement wallet connection logic here
        set((state) => ({
          [blockchain]: {
            ...state[blockchain],
            isConnected: true,
            address: "0x123...", // Replace with actual address
            balance: "0.0",
            error: null,
          },
        }));
      }
    } catch (error) {
      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          error: error instanceof Error ? error.message : "Connection failed",
        },
      }));
    }
  },
  disconnectWallet: (blockchain) => {
    if (blockchain === "stacks") {
      stacksService.disconnect();
    } else if (blockchain === "bitcoin") {
      bitcoinService.disconnect();
    }

    set((state) => ({
      [blockchain]: {
        ...state[blockchain],
        isConnected: false,
        address: null,
        balance: null,
        error: null,
      },
    }));
  },
  setError: (blockchain, error) => {
    set((state) => ({
      [blockchain]: {
        ...state[blockchain],
        error,
      },
    }));
  },
  clearError: (blockchain) => {
    set((state) => ({
      [blockchain]: {
        ...state[blockchain],
        error: null,
      },
    }));
  },
}));
