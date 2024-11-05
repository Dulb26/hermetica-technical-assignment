import { create } from "zustand";
import bitcoinService from "../services/bitcoinService";
import { solanaService } from "../services/solanaService";
import { stacksService } from "../services/stacksService";
import { BlockchainType, WalletStore } from "../types/wallet";

interface ServiceResponse {
  address: string;
  balance?: string;
}

export const useWalletStore = create<WalletStore>((set) => ({
  bitcoin: {
    isConnected: false,
    isLoading: false,
    address: null,
    balance: null,
    error: null,
  },
  stacks: {
    isConnected: false,
    isLoading: false,
    address: null,
    balance: null,
    error: null,
  },
  solana: {
    isConnected: false,
    isLoading: false,
    address: null,
    balance: null,
    error: null,
  },
  connectWallet: async (blockchain: BlockchainType) => {
    set((state) => ({
      [blockchain]: {
        ...state[blockchain],
        isLoading: true,
      },
    }));

    try {
      let response: ServiceResponse;

      if (blockchain === "stacks") {
        response = (await stacksService.connect()) as ServiceResponse;
        const balance = await stacksService.getBalance(response.address);
        response.balance = balance;
      } else if (blockchain === "bitcoin") {
        response = await bitcoinService.connect();
        try {
          response.balance = await bitcoinService.getBalance();
        } catch (error) {
          console.warn("Failed to fetch balance:", error);
        }
      } else if (blockchain === "solana") {
        const result = await solanaService.connect();
        if (!result) throw new Error("Failed to connect Solana wallet");
        response = result;
      } else {
        throw new Error("Unsupported blockchain");
      }

      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          isConnected: true,
          isLoading: false,
          address: response.address,
          balance: response.balance ?? null,
          error: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          isLoading: false,
          error: error instanceof Error ? error.message : "Connection failed",
        },
      }));
    }
  },
  disconnectWallet: async (blockchain: BlockchainType) => {
    set((state) => ({
      [blockchain]: {
        ...state[blockchain],
        isLoading: true,
      },
    }));

    try {
      if (blockchain === "stacks") {
        stacksService.disconnect();
      } else if (blockchain === "bitcoin") {
        bitcoinService.disconnect();
      } else if (blockchain === "solana") {
        await solanaService.disconnect();
      }

      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          isConnected: false,
          isLoading: false,
          address: null,
          balance: null,
          error: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Disconnection failed",
        },
      }));
    }
  },
  transfer: async (
    blockchain: BlockchainType,
    address: string,
    amount: number,
  ) => {
    set((state) => ({
      [blockchain]: {
        ...state[blockchain],
        isLoading: true,
      },
    }));

    try {
      switch (blockchain) {
        case "bitcoin":
          await bitcoinService.sendBitcoin(address, amount);
          break;
        case "stacks":
          throw new Error("Stacks transfer not implemented");
        case "solana":
          throw new Error("Solana transfer not implemented");
        default:
          throw new Error(`Unsupported blockchain: ${blockchain}`);
      }

      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          isLoading: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        [blockchain]: {
          ...state[blockchain],
          isLoading: false,
        },
      }));
      throw error instanceof Error ? error : new Error("Transfer failed");
    }
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
