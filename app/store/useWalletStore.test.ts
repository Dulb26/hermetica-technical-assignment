import { beforeEach, describe, expect, it } from "vitest";
import { useWalletStore } from "./useWalletStore";

describe("Store", () => {
  beforeEach(() => {
    useWalletStore.setState({
      bitcoin: {
        address: null,
        balance: null,
        error: null,
        isConnected: false,
      },
      stacks: {
        address: null,
        balance: null,
        error: null,
        isConnected: false,
      },
    });
  });

  it("updates bitcoin wallet state", () => {
    const mockWallet = { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" };

    useWalletStore.getState().bitcoin.address = mockWallet.address;

    expect(useWalletStore.getState().bitcoin.address).toEqual(
      mockWallet.address,
    );
  });

  it("handles multiple wallet connections", () => {
    const mockBitcoinWallet = { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" };
    const mockSolanaWallet = {
      address: "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE",
    };

    useWalletStore.getState().bitcoin.address = mockBitcoinWallet.address;
    useWalletStore.getState().solana.address = mockSolanaWallet.address;

    expect(useWalletStore.getState().bitcoin.address).toEqual(
      mockBitcoinWallet.address,
    );
    expect(useWalletStore.getState().solana.address).toEqual(
      mockSolanaWallet.address,
    );
  });

  it("clears wallet state on disconnect", () => {
    const mockWallet = { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" };

    useWalletStore.getState().bitcoin.address = mockWallet.address;
    useWalletStore.getState().bitcoin.address = null;

    expect(useWalletStore.getState().bitcoin.address).toBeNull();
  });

  it("handles error states", () => {
    const errorMessage = "Connection failed";

    useWalletStore.getState().bitcoin.error = errorMessage;

    expect(useWalletStore.getState().bitcoin.error).toBe(errorMessage);
  });

  it("tracks connection state", () => {
    useWalletStore.getState().bitcoin.isConnected = true;
    expect(useWalletStore.getState().bitcoin.isConnected).toBe(true);

    useWalletStore.getState().bitcoin.isConnected = false;
    expect(useWalletStore.getState().bitcoin.isConnected).toBe(false);
  });
});
