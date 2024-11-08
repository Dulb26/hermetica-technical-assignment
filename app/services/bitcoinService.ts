import { AddressPurpose } from "sats-connect";

class BitcoinService {
  private isConnected: boolean = false;

  async connect(): Promise<{ address: string }> {
    try {
      const { default: Wallet } = await import("sats-connect");

      const response = await Wallet.request("getAccounts", {
        purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
      });

      if (response.status === "success") {
        this.isConnected = true;

        const paymentAddress = response.result.find(
          (addr) => addr.purpose === AddressPurpose.Payment,
        );

        if (!paymentAddress) {
          throw new Error("No payment address found");
        }

        return { address: paymentAddress.address };
      } else {
        throw new Error(response.error.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to connect wallet: ${errorMessage}`);
    }
  }

  async getBalance(): Promise<string> {
    try {
      const { default: Wallet } = await import("sats-connect");
      const response = await Wallet.request("getBalance", undefined);

      if (response.status === "success") {
        return (Number(response.result.total) / 100000000).toString();
      }
      throw new Error("Failed to fetch balance");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get balance: ${errorMessage}`);
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  async sendBitcoin(
    recipientAddress: string,
    amountInSats: number,
  ): Promise<string> {
    try {
      const { default: Wallet } = await import("sats-connect");
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to send Bitcoin: ${errorMessage}`);
    }
  }

  async signMessage(message: string, address: string): Promise<string> {
    try {
      const { default: Wallet } = await import("sats-connect");
      const response = await Wallet.request("signMessage", {
        message,
        address,
      });

      if (response.status === "success") {
        return response.result.signature;
      }
      throw new Error("Failed to sign message");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to sign message: ${errorMessage}`);
    }
  }
}

const bitcoinService = new BitcoinService();
export default bitcoinService;
