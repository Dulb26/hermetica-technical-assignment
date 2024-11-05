import { WalletFactory } from "./wallets/bitcoinWalletFactory";
import { BitcoinWalletProvider } from "./wallets/types";

class BitcoinService {
  private isConnected: boolean = false;
  private wallet: BitcoinWalletProvider | null = null;

  async connect(): Promise<{ address: string }> {
    try {
      this.wallet = await WalletFactory.createWallet();
      const result = await this.wallet.connect();
      this.isConnected = true;
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to connect wallet: ${errorMessage}`);
    }
  }

  async getBalance(): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    try {
      return await this.wallet.getBalance();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get balance: ${errorMessage}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
    }
    this.isConnected = false;
    this.wallet = null;
  }

  async sendBitcoin(
    recipientAddress: string,
    amountInSats: number,
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    try {
      return await this.wallet.sendBitcoin(recipientAddress, amountInSats);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to send Bitcoin: ${errorMessage}`);
    }
  }

  async signMessage(message: string, address: string): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }
    try {
      return await this.wallet.signMessage(message, address);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to sign message: ${errorMessage}`);
    }
  }
}

const bitcoinService = new BitcoinService();
export default bitcoinService;
