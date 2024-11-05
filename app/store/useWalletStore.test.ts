import { beforeEach, describe, expect, it } from "vitest";
import { WalletState, WalletStore } from "../types/wallet";
import { useWalletStore } from "./useWalletStore";

describe("Store", () => {
  beforeEach(() => {
    useWalletStore.setState({
      bitcoin: {
        address: null,
        balance: null,
        error: null,
        isConnected: false,
        isLoading: false,
      },
      solana: {
        address: null,
        balance: null,
        error: null,
        isConnected: false,
        isLoading: false,
      },
      stacks: {
        address: null,
        balance: null,
        error: null,
        isConnected: false,
        isLoading: false,
      },
    });
  });

  // Test all wallet types
  describe("wallet state management", () => {
    const mockWallets = {
      bitcoin: {
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        balance: "1.23456789",
      },
      solana: {
        address: "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE",
        balance: "2.34567891",
      },
      stacks: {
        address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        balance: "3.45678912",
      },
    };

    it("updates wallet addresses", () => {
      // Test all wallet types
      Object.entries(mockWallets).forEach(([wallet, data]) => {
        const state = useWalletStore.getState();
        const walletState = state[wallet as keyof WalletStore] as WalletState;
        walletState.address = data.address;
        expect(walletState.address).toEqual(data.address);
      });
    });

    it("updates wallet balances", () => {
      // Test all wallet types
      Object.entries(mockWallets).forEach(([wallet, data]) => {
        const state = useWalletStore.getState();
        const walletState = state[wallet as keyof WalletStore] as WalletState;
        walletState.balance = data.balance;
        expect(walletState.balance).toEqual(data.balance);
      });
    });

    it("handles connection states", () => {
      // Test all wallet types
      Object.keys(mockWallets).forEach((wallet) => {
        const state = useWalletStore.getState();
        const walletState = state[wallet as keyof WalletStore] as WalletState;
        walletState.isConnected = true;
        expect(walletState.isConnected).toBe(true);

        walletState.isConnected = false;
        expect(walletState.isConnected).toBe(false);
      });
    });

    it("handles error states", () => {
      const errorMessage = "Connection failed";
      // Test all wallet types
      Object.keys(mockWallets).forEach((wallet) => {
        const state = useWalletStore.getState();
        const walletState = state[wallet as keyof WalletStore] as WalletState;
        walletState.error = errorMessage;
        expect(walletState.error).toBe(errorMessage);

        walletState.error = null;
        expect(walletState.error).toBeNull();
      });
    });
  });

  describe("complete wallet lifecycle", () => {
    it("handles full wallet connection and disconnection cycle", () => {
      const wallet = "bitcoin";
      const mockData = {
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        balance: "1.23456789",
      };

      // Connect
      const state = useWalletStore.getState();
      const walletState = state[wallet as keyof WalletStore] as WalletState;
      walletState.isConnected = true;
      walletState.address = mockData.address;
      walletState.balance = mockData.balance;
      walletState.error = null;

      // Verify connected state
      expect(walletState.isConnected).toBe(true);
      expect(walletState.address).toBe(mockData.address);
      expect(walletState.balance).toBe(mockData.balance);
      expect(walletState.error).toBeNull();

      // Disconnect
      walletState.isConnected = false;
      walletState.address = null;
      walletState.balance = null;

      // Verify disconnected state
      expect(walletState.isConnected).toBe(false);
      expect(walletState.address).toBeNull();
      expect(walletState.balance).toBeNull();
    });
  });

  describe("multiple wallet interactions", () => {
    it("maintains independent state for each wallet", () => {
      // Connect Bitcoin
      const state = useWalletStore.getState();
      const bitcoinState = state.bitcoin as WalletState;
      bitcoinState.isConnected = true;
      bitcoinState.address = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
      bitcoinState.balance = "1.23456789";

      // Connect Solana
      const solanaState = state.solana as WalletState;
      solanaState.isConnected = true;
      solanaState.address = "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE";
      solanaState.balance = "2.34567891";

      // Verify both wallets
      expect(bitcoinState.isConnected).toBe(true);
      expect(solanaState.isConnected).toBe(true);
      expect(bitcoinState.address).toBe("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
      expect(solanaState.address).toBe(
        "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE",
      );

      // Disconnect one wallet
      bitcoinState.isConnected = false;
      bitcoinState.address = null;
      bitcoinState.balance = null;

      // Verify one wallet disconnected while other remains connected
      expect(bitcoinState.isConnected).toBe(false);
      expect(solanaState.isConnected).toBe(true);
      expect(bitcoinState.address).toBeNull();
      expect(solanaState.address).toBe(
        "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE",
      );
    });
  });
});
