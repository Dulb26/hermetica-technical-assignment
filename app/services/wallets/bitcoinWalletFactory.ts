import { LeatherWallet } from "./leatherWallet";
import { PhantomWallet } from "./phantomWallet";
import { SatsConnectWallet } from "./satsConnectWallet";
import { BitcoinWalletProvider } from "./types";

export class WalletFactory {
  static async createWallet(): Promise<BitcoinWalletProvider> {
    // Try Phantom first
    if ("phantom" in window && window.phantom?.bitcoin?.isPhantom) {
      return new PhantomWallet();
    }
    // Try Leather second
    if ("LeatherProvider" in window) {
      return new LeatherWallet();
    }
    // Fall back to Sats Connect
    return new SatsConnectWallet();
  }
}
