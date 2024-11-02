import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import bitcoinService from "../services/bitcoinService";
import { useWalletStore } from "../store/useWalletStore";
import { BitcoinTransfer } from "./BitcoinTransfer";

// Mock the bitcoin service
vi.mock("@/services/bitcoinService", () => ({
  sendBitcoin: vi.fn(),
}));

describe("BitcoinTransfer Component", () => {
  const mockWallet = { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" };

  beforeEach(() => {
    useWalletStore.setState({
      bitcoin: {
        address: mockWallet.address,
        balance: null,
        error: null,
        isConnected: true,
      },
    });
  });

  it("validates bitcoin address format", async () => {
    render(<BitcoinTransfer />);

    const addressInput = screen.getByLabelText(/recipient address/i);
    fireEvent.change(addressInput, { target: { value: "invalid-address" } });

    expect(screen.getByText(/invalid bitcoin address/i)).toBeInTheDocument();
  });

  it("validates amount input", async () => {
    render(<BitcoinTransfer />);

    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: "-1" } });

    expect(
      screen.getByText(/amount must be greater than 0/i),
    ).toBeInTheDocument();
  });

  it("handles transfer errors", async () => {
    const errorMessage = "Insufficient funds";
    vi.mocked(bitcoinService.sendBitcoin).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    render(<BitcoinTransfer />);

    fireEvent.change(screen.getByLabelText(/recipient address/i), {
      target: { value: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "0.001" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
