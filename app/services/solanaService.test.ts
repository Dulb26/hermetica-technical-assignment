import Solflare from "@solflare-wallet/sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { solanaService } from "./solanaService";

// Mock @solana/web3.js
vi.mock("@solana/web3.js", () => {
  const mockConnection = vi.fn(() => ({
    getBalance: vi.fn(),
    getLatestBlockhash: vi.fn(),
    sendRawTransaction: vi.fn(),
    confirmTransaction: vi.fn(),
  }));

  // Add the methods to the prototype so they can be mocked
  mockConnection.prototype.getBalance = vi.fn();
  mockConnection.prototype.getLatestBlockhash = vi.fn();
  mockConnection.prototype.sendRawTransaction = vi.fn();
  mockConnection.prototype.confirmTransaction = vi.fn();

  return {
    Connection: mockConnection,
    PublicKey: vi.fn(),
    Transaction: vi.fn(() => ({
      add: vi.fn().mockReturnThis(),
      serialize: vi.fn(),
    })),
    SystemProgram: {
      transfer: vi.fn(),
    },
    LAMPORTS_PER_SOL: 1000000000,
    clusterApiUrl: vi.fn(),
  };
});

// Mock Solflare SDK
vi.mock("@solflare-wallet/sdk", () => ({
  default: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    publicKey: { toString: () => "testPublicKey" },
    connected: true,
    signTransaction: vi.fn(),
  })),
}));

describe("SolanaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connects successfully", async () => {
    const mockBalance = "1.000000";
    vi.spyOn(solanaService, "getBalance").mockResolvedValueOnce(mockBalance);

    const result = await solanaService.connect();
    expect(result).toEqual({
      address: "testPublicKey",
      balance: mockBalance,
    });
  });

  it("handles connection failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const mockError = new Error("Connection failed");

    // Mock both the connect and getBalance to ensure proper error propagation
    vi.mocked(new Solflare()).connect.mockRejectedValueOnce(mockError);
    vi.spyOn(solanaService, "getBalance").mockRejectedValueOnce(mockError);

    await expect(solanaService.connect(1)).rejects.toThrow(mockError);
  });

  it("disconnects successfully", async () => {
    const result = await solanaService.disconnect();
    expect(result).toBe(true);
  });
});
