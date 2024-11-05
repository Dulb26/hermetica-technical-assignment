import { BitcoinWalletProvider, LeatherProvider } from "./types";

export class LeatherWallet implements BitcoinWalletProvider {
  private provider: LeatherProvider | null = null;

  private async getProvider(): Promise<LeatherProvider | null> {
    if ("LeatherProvider" in window) {
      return window.LeatherProvider || null;
    }
    return null;
  }

  async connect(): Promise<{ address: string }> {
    this.provider = await this.getProvider();
    if (!this.provider) {
      throw new Error("Leather wallet not available");
    }

    const response = await this.provider.request("getAddresses");
    const addresses = response.result.addresses ?? [];
    const paymentAddress = addresses.find(
      (addr: { type: string; symbol: string }) =>
        addr.type === "p2wpkh" && addr.symbol === "BTC",
    );

    if (!paymentAddress) {
      throw new Error("No payment address found");
    }

    return { address: paymentAddress.address };
  }

  async getBalance(): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    const response = await this.provider.request("getAddresses");
    const addresses = response.result.addresses ?? [];
    const paymentAddress = addresses.find(
      (addr: { type: string; symbol: string }) =>
        addr.type === "p2wpkh" && addr.symbol === "BTC",
    );

    if (!paymentAddress) {
      throw new Error("No payment address found");
    }

    const balanceResponse = await fetch(
      `https://blockstream.info/api/address/${paymentAddress.address}`,
    );
    const data = await balanceResponse.json();
    return (
      Number(data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) /
      100000000
    ).toString();
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    const response = await this.provider.request("signMessage", {
      message,
      paymentType: "p2wpkh",
    });

    return response.result.signature ?? "";
  }

  async sendBitcoin(
    recipientAddress: string,
    amountInSats: number,
  ): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    const response = await this.provider.request("sendTransfer", {
      recipients: [
        {
          address: recipientAddress,
          amount: amountInSats.toString(),
        },
      ],
    });

    return response.result.txid ?? "";
  }

  async disconnect(): Promise<void> {
    this.provider = null;
  }
}
