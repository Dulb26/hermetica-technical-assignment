import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import toast from "react-hot-toast";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWalletStore } from "../store/useWalletStore";
import { BitcoinTransfer } from "./BitcoinTransfer";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock bitcoinService
vi.mock("../services/bitcoinService", () => ({
  default: {
    sendBitcoin: vi.fn(),
  },
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

  // Add cleanup after each test
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("validates bitcoin address format on blur", async () => {
    render(<BitcoinTransfer />);

    const addressInput = screen.getByTestId("recipient-address-input");

    // First change the value
    fireEvent.change(addressInput, {
      target: { value: "invalid-address" },
    });

    // No validation error should be shown yet
    expect(toast.error).not.toHaveBeenCalled();

    // Trigger blur event
    fireEvent.blur(addressInput);

    // Now check for validation error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Invalid Bitcoin address format",
      );
    });
  });

  it("validates amount input on blur", async () => {
    render(<BitcoinTransfer />);

    const amountInput = screen.getByTestId("amount-input");

    // First change the value
    fireEvent.change(amountInput, {
      target: { value: "0.00000001" },
    });

    // No validation error should be shown yet
    expect(toast.error).not.toHaveBeenCalled();

    // Trigger blur event
    fireEvent.blur(amountInput);

    // Now check for validation error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Amount must be at least 1500 satoshis (0.00001500 BTC)",
      );
    });
  });

  it("should not show validation errors while typing", () => {
    render(<BitcoinTransfer />);

    const addressInput = screen.getByTestId("recipient-address-input");
    const amountInput = screen.getByTestId("amount-input");

    // Type invalid values
    fireEvent.change(addressInput, {
      target: { value: "invalid-address" },
    });
    fireEvent.change(amountInput, {
      target: { value: "0.00000001" },
    });

    // Verify no validation errors are shown
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("handles transfer errors", async () => {
    const errorMessage = "Insufficient funds";

    // Mock the transfer function in useWalletStore
    const mockTransfer = vi.fn().mockRejectedValueOnce(new Error(errorMessage));
    useWalletStore.setState({
      bitcoin: {
        address: mockWallet.address,
        balance: null,
        error: null,
        isConnected: true,
      },
      transfer: mockTransfer,
    });

    render(<BitcoinTransfer />);

    // Fill in the form with valid values
    fireEvent.change(screen.getByTestId("recipient-address-input"), {
      target: { value: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    });

    // Use a valid amount that meets minimum requirement (> 0.00001500 BTC)
    fireEvent.change(screen.getByTestId("amount-input"), {
      target: { value: "0.001" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Verify the transfer function was called with correct parameters
    await waitFor(() => {
      expect(mockTransfer).toHaveBeenCalledWith(
        "bitcoin",
        "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        100000, // 0.001 BTC in satoshis
      );
    });

    // Verify the error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("confirms successful transfer initiation", async () => {
    // Mock the transfer function in useWalletStore
    const mockTransfer = vi.fn().mockResolvedValueOnce(undefined);
    useWalletStore.setState({
      bitcoin: {
        address: mockWallet.address,
        balance: null,
        error: null,
        isConnected: true,
      },
      transfer: mockTransfer,
    });

    render(<BitcoinTransfer />);

    // Fill in the form with valid values
    fireEvent.change(screen.getByTestId("recipient-address-input"), {
      target: { value: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    });

    fireEvent.change(screen.getByTestId("amount-input"), {
      target: { value: "0.001" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Verify the transfer function was called with correct parameters
    await waitFor(() => {
      expect(mockTransfer).toHaveBeenCalledWith(
        "bitcoin",
        "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        100000, // 0.001 BTC in satoshis
      );
    });

    // Verify success toast was shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Transfer completed successfully!",
      );
    });

    // Verify form was reset
    await waitFor(() => {
      expect(screen.getByTestId("amount-input")).toHaveProperty("value", "");
      expect(screen.getByTestId("recipient-address-input")).toHaveProperty(
        "value",
        "",
      );
    });
  });
});
