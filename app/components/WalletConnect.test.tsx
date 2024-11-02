import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import bitcoinService from "../services/bitcoinService";
import { solanaService } from "../services/solanaService";
import { useWalletStore } from "../store/useWalletStore";
import { WalletConnect } from "./WalletConnect";

vi.mock("../services/bitcoinService", () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

vi.mock("../services/solanaService", () => ({
  solanaService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

describe("WalletConnect Component", () => {
  beforeEach(() => {
    // Reset store state before each test
    useWalletStore.setState({
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
    });
  });

  it("renders connect buttons for all supported chains", () => {
    render(
      <>
        <WalletConnect type="bitcoin" isConnected={false} icon="bitcoin-icon" />
        ,
        <WalletConnect type="stacks" isConnected={false} icon="stacks-icon" />,
        <WalletConnect type="solana" isConnected={false} icon="solana-icon" />,
      </>,
    );

    expect(
      screen.getByRole("button", { name: /connect bitcoin/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /connect stacks/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /connect solana/i }),
    ).toBeInTheDocument();
  });

  it("handles successful Bitcoin wallet connection", async () => {
    const mockWallet = { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" };
    vi.mocked(bitcoinService.connect).mockResolvedValueOnce(mockWallet);

    render(
      <WalletConnect type="bitcoin" isConnected={false} icon="bitcoin-icon" />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /connect bitcoin/i }));
    });

    expect(useWalletStore.getState().bitcoin.address).toEqual(
      mockWallet.address,
    );
    expect(screen.getByText(mockWallet.address)).toBeInTheDocument();
  });

  it("handles wallet connection errors", async () => {
    const errorMessage = "Failed to connect wallet";
    vi.mocked(bitcoinService.connect).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    const { getByRole } = render(
      <WalletConnect type="bitcoin" isConnected={false} icon="bitcoin-icon" />,
    );

    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Connect bitcoin wallet" }));
    });

    expect(useWalletStore.getState().bitcoin.error).toBe(errorMessage);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("allows simultaneous connections to multiple chains", async () => {
    const mockBitcoinWallet = {
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      balance: "0.00",
    };
    const mockSolanaWallet = {
      address: "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE",
      balance: "0.00",
    };

    vi.mocked(bitcoinService.connect).mockResolvedValueOnce(mockBitcoinWallet);
    vi.mocked(solanaService.connect).mockResolvedValueOnce(mockSolanaWallet);

    render(
      <WalletConnect type="bitcoin" isConnected={false} icon="bitcoin-icon" />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /connect bitcoin/i }));
      fireEvent.click(screen.getByRole("button", { name: /connect solana/i }));
    });

    expect(useWalletStore.getState().bitcoin.address).toEqual(
      mockBitcoinWallet.address,
    );
    expect(useWalletStore.getState().solana.address).toEqual(
      mockSolanaWallet.address,
    );
  });
});
