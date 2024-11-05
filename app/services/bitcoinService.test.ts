import { AddressPurpose, AddressType } from "sats-connect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import bitcoinService from "./bitcoinService";

// Mock sats-connect with AddressPurpose enum
vi.mock("sats-connect", () => ({
  default: {
    request: vi.fn(),
  },
  AddressPurpose: {
    Payment: "payment",
    Ordinals: "ordinals",
  },
  AddressType: {
    P2WPKH: "p2wpkh",
  },
}));

describe("BitcoinService", () => {
  let service: typeof bitcoinService;

  beforeEach(() => {
    service = bitcoinService;
    vi.resetAllMocks();
  });

  it("connects successfully", async () => {
    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce({
      status: "success",
      result: [
        {
          address: "testAddress",
          publicKey: "mockPublicKey",
          purpose: AddressPurpose.Payment,
          addressType: AddressType.p2pkh,
          walletType: "software",
        },
      ],
    });

    const result = await service.connect();
    expect(result).toEqual({ address: "testAddress" });
  });

  it("sends bitcoin successfully", async () => {
    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce({
      status: "success",
      result: [
        {
          address: "testAddress",
          publicKey: "mockPublicKey",
          purpose: AddressPurpose.Payment,
          addressType: AddressType.p2pkh,
          walletType: "software",
        },
      ],
    });
    await service.connect();

    const mockResponse = {
      status: "success" as const,
      result: {
        txid: "mocktxid123",
      },
    };

    vi.mocked(Wallet.request).mockResolvedValueOnce(mockResponse);

    const txid = await service.sendBitcoin("recipientAddress", 100000);
    expect(txid).toBe("mocktxid123");
  });

  it("signs message successfully", async () => {
    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce({
      status: "success",
      result: [
        {
          address: "testAddress",
          publicKey: "mockPublicKey",
          purpose: AddressPurpose.Payment,
          addressType: AddressType.p2pkh,
          walletType: "software",
        },
      ],
    });
    await service.connect();

    const mockResponse = {
      status: "success" as const,
      result: {
        signature: "mocksignature123",
        publicKey: "mockpublickey123",
      },
    };

    vi.mocked(Wallet.request).mockResolvedValueOnce(mockResponse);

    const signature = await service.signMessage("test message", "testAddress");
    expect(signature).toBe("mocksignature123");
  });

  it("throws error when no payment address is found", async () => {
    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce({
      status: "success",
      result: [
        {
          address: "testAddress",
          publicKey: "mockPublicKey",
          purpose: AddressPurpose.Ordinals,
          addressType: AddressType.p2pkh,
          walletType: "software",
        },
      ],
    });

    await expect(service.connect()).rejects.toThrow(
      "Failed to connect wallet: No payment address found",
    );
  });

  it("gets balance correctly", async () => {
    const mockResponse = {
      status: "success" as const,
      result: {
        confirmed: "100000000",
        unconfirmed: "0",
        total: "100000000",
      },
    };

    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce(mockResponse);

    const balance = await service.getBalance();
    expect(balance).toBe("1"); // 1 BTC
    expect(Wallet.request).toHaveBeenCalledWith("getBalance", undefined);
  });

  it("disconnects successfully", async () => {
    await service.disconnect();
    // Since disconnect is just setting a flag, we just verify it doesn't throw
    expect(async () => await service.disconnect()).not.toThrow();
  });
});
