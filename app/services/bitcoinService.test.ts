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
    P2SH_P2WPKH: "p2sh-p2wpkh",
    P2PKH: "p2pkh",
    P2WPKH_BIP143: "p2wpkh-bip143",
    P2SH_P2WPKH_BIP143: "p2sh-p2wpkh-bip143",
    P2PKH_BIP143: "p2pkh-bip143",
    P2WPKH_BIP143_P2PKH: "p2wpkh-bip143-p2pkh",
    P2WPKH_BIP143_P2PKH_BIP143: "p2wpkh-bip143-p2pkh-bip143",
    P2WPKH_BIP143_P2PKH_BIP143_BIP143: "p2wpkh-bip143-p2pkh-bip143-bip143",
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
    expect(Wallet.request).toHaveBeenCalledWith("getAccounts", {
      purposes: ["payment", "ordinals"],
    });
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

  it("sends bitcoin successfully", async () => {
    const mockResponse = {
      status: "success" as const,
      result: {
        txid: "mocktxid123",
      },
    };

    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce(mockResponse);

    const txid = await service.sendBitcoin("recipientAddress", 100000);
    expect(txid).toBe("mocktxid123");
    expect(Wallet.request).toHaveBeenCalledWith("sendTransfer", {
      recipients: [
        {
          address: "recipientAddress",
          amount: 100000,
        },
      ],
    });
  });

  it("signs message successfully", async () => {
    const mockResponse = {
      status: "success" as const,
      result: {
        signature: "mocksignature123",
        publicKey: "mockpublickey123",
      },
    };

    const { default: Wallet } = await import("sats-connect");
    vi.mocked(Wallet.request).mockResolvedValueOnce(mockResponse);

    const signature = await service.signMessage("test message", "testAddress");
    expect(signature).toBe("mocksignature123");
    expect(Wallet.request).toHaveBeenCalledWith("signMessage", {
      message: "test message",
      address: "testAddress",
    });
  });
});
