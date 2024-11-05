import { PhantomWallet } from "./phantomWallet";
import { SatsConnectWallet } from "./satsConnectWallet";
import { BitcoinWalletProvider } from "./types";

export class WalletFactory {
  static async createWallet(): Promise<BitcoinWalletProvider> {
    // Try Phantom first
    if ("phantom" in window && window.phantom?.bitcoin?.isPhantom) {
      return new PhantomWallet();
    }
    // Fall back to Sats Connect
    return new SatsConnectWallet();
  }
}
