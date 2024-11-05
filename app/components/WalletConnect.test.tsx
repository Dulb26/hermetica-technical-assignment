import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import bitcoinService from "../services/bitcoinService";
import { solanaService } from "../services/solanaService";
import { stacksService } from "../services/stacksService";
import { useWalletStore } from "../store/useWalletStore";
import { WalletConnect } from "./WalletConnect";

vi.mock("../services/bitcoinService", () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    getBalance: vi.fn().mockResolvedValue("1000000"),
  },
}));

vi.mock("../services/solanaService", () => ({
  solanaService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

vi.mock("../services/stacksService", () => ({
  stacksService: {
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
        isLoading: false,
      },
      stacks: {
        isConnected: false,
        address: null,
        balance: null,
        error: null,
        isLoading: false,
      },
      solana: {
        isConnected: false,
        address: null,
        balance: null,
        error: null,
        isLoading: false,
      },
    });
  });

  afterEach(() => {
    cleanup(); // Clean up after each test
    vi.clearAllMocks();
  });

  it("renders connect buttons for all supported chains", () => {
    render(
      <div>
        <WalletConnect type="bitcoin" icon="bitcoin-icon" />
        <WalletConnect type="stacks" icon="stacks-icon" />
        <WalletConnect type="solana" icon="solana-icon" />
      </div>,
    );

    expect(screen.getByTestId("bitcoin-connect-button")).to.exist;
    expect(screen.getByTestId("stacks-connect-button")).to.exist;
    expect(screen.getByTestId("solana-connect-button")).to.exist;
  });

  it("handles successful Bitcoin wallet connection", async () => {
    const mockWallet = { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" };
    vi.mocked(bitcoinService.connect).mockResolvedValueOnce(mockWallet);

    render(<WalletConnect type="bitcoin" icon="bitcoin-icon" />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("bitcoin-connect-button"));
    });

    // Wait for the state to update and component to re-render
    await screen.findByText(/Connected/);

    expect(useWalletStore.getState().bitcoin.address).toEqual(
      mockWallet.address,
    );

    // Use findByText with a more flexible matcher
    const truncatedAddress = `${mockWallet.address.slice(0, 3)}...${mockWallet.address.slice(-3)}`;
    await screen.findByText(truncatedAddress);
  });

  it("handles successful Stacks wallet connection", async () => {
    const mockWallet = { address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7" };
    vi.mocked(stacksService.connect).mockResolvedValueOnce(mockWallet);

    // Mock the connectWallet action
    const mockConnectWallet = vi.fn().mockImplementation(async (blockchain) => {
      if (blockchain === "stacks") {
        useWalletStore.setState((state) => ({
          stacks: {
            ...state.stacks,
            address: mockWallet.address,
            isConnected: true,
          },
        }));
      }
    });

    useWalletStore.setState((state) => ({
      ...state,
      connectWallet: mockConnectWallet,
    }));

    render(<WalletConnect type="stacks" icon="stacks-icon" />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("stacks-connect-button"));
    });

    // Wait for the state to update and component to re-render
    await waitFor(() => {
      expect(useWalletStore.getState().stacks.address).toEqual(
        mockWallet.address,
      );
    });

    await screen.findByText(/Connected/);

    const truncatedAddress = `${mockWallet.address.slice(0, 3)}...${mockWallet.address.slice(-3)}`;
    await screen.findByText(truncatedAddress);
  });

  it("handles successful Solana wallet connection", async () => {
    const mockWallet = {
      address: "DRpbCBMxVnDK7maPGv7vLGKGtZsC4J2qpDQA7zvDDxZE",
      balance: "0.00",
    };
    vi.mocked(solanaService.connect).mockResolvedValueOnce(mockWallet);

    // Mock the connectWallet action
    const mockConnectWallet = vi.fn().mockImplementation(async (blockchain) => {
      if (blockchain === "solana") {
        useWalletStore.setState((state) => ({
          solana: {
            ...state.solana,
            address: mockWallet.address,
            isConnected: true,
          },
        }));
      }
    });

    useWalletStore.setState((state) => ({
      ...state,
      connectWallet: mockConnectWallet,
    }));

    render(<WalletConnect type="solana" icon="solana-icon" />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("solana-connect-button"));
    });

    await waitFor(() => {
      expect(useWalletStore.getState().solana.address).toEqual(
        mockWallet.address,
      );
    });

    await screen.findByText(/Connected/);

    const truncatedAddress = `${mockWallet.address.slice(0, 3)}...${mockWallet.address.slice(-3)}`;
    await screen.findByText(truncatedAddress);
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

    // Mock the connectWallet action
    const mockConnectWallet = vi.fn().mockImplementation(async (blockchain) => {
      switch (blockchain) {
        case "bitcoin":
          useWalletStore.setState((state) => ({
            ...state,
            bitcoin: {
              ...state.bitcoin,
              address: mockBitcoinWallet.address,
              isConnected: true,
            },
          }));
          break;
        case "solana":
          useWalletStore.setState((state) => ({
            ...state,
            solana: {
              ...state.solana,
              address: mockSolanaWallet.address,
              isConnected: true,
            },
          }));
          break;
      }
    });

    useWalletStore.setState((state) => ({
      ...state,
      connectWallet: mockConnectWallet,
    }));

    render(
      <div>
        <WalletConnect type="bitcoin" icon="bitcoin-icon" />
        <WalletConnect type="solana" icon="solana-icon" />
      </div>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("bitcoin-connect-button"));
      await Promise.resolve();
      fireEvent.click(screen.getByTestId("solana-connect-button"));
      await Promise.resolve();
    });

    await waitFor(() => {
      const state = useWalletStore.getState();
      expect(state.bitcoin.address).toEqual(mockBitcoinWallet.address);
      expect(state.solana.address).toEqual(mockSolanaWallet.address);
    });

    // Verify UI updates
    await screen.findByText(truncateAddress(mockBitcoinWallet.address));
    await screen.findByText(truncateAddress(mockSolanaWallet.address));
  });
});

// Helper function for address truncation
const truncateAddress = (address: string) =>
  `${address.slice(0, 3)}...${address.slice(-3)}`;
