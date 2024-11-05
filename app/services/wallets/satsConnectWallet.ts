import { AddressPurpose } from "sats-connect";
import { BitcoinWalletProvider } from "./types";

export class SatsConnectWallet implements BitcoinWalletProvider {
  private Wallet: (typeof import("sats-connect"))["default"] | undefined;

  private async loadWallet() {
    if (!this.Wallet) {
      const { default: Wallet } = await import("sats-connect");
      this.Wallet = Wallet;
      console.log("Wallet", Wallet);
    }
    return this.Wallet;
  }

  async connect(): Promise<{ address: string }> {
    const Wallet = await this.loadWallet();
    const response = await Wallet.request("getAccounts", {
      purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
    });

    if (response.status === "success") {
      const paymentAddress = response.result.find(
        (addr) => addr.purpose === AddressPurpose.Payment,
      );

      if (!paymentAddress) {
        throw new Error("No payment address found");
      }

      return { address: paymentAddress.address };
    }
    throw new Error(response.error.message);
  }

  async getBalance(): Promise<string> {
    const Wallet = await this.loadWallet();
    const response = await Wallet.request("getBalance", undefined);

    if (response.status === "success") {
      return (Number(response.result.total) / 100000000).toString();
    }
    throw new Error("Failed to fetch balance");
  }

  async sendBitcoin(
    recipientAddress: string,
    amountInSats: number,
  ): Promise<string> {
    const Wallet = await this.loadWallet();
    const response = await Wallet.request("sendTransfer", {
      recipients: [
        {
          address: recipientAddress,
          amount: amountInSats,
        },
      ],
    });

    if (response.status === "success") {
      return response.result.txid;
    }
    throw new Error("Failed to send Bitcoin");
  }

  async signMessage(message: string, address: string): Promise<string> {
    const Wallet = await this.loadWallet();
    const response = await Wallet.request("signMessage", {
      message,
      address,
    });

    if (response.status === "success") {
      return response.result.signature;
    }
    throw new Error("Failed to sign message");
  }

  async disconnect(): Promise<void> {
    // No disconnect method in Sats Connect
  }
}
