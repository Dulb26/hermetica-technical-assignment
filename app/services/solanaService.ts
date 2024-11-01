import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import Solflare from "@solflare-wallet/sdk";

const connection = new Connection(
  import.meta.env.VITE_SOLANA_CONNECTION_URL || clusterApiUrl("mainnet-beta"),
  "confirmed",
);
const wallet = new Solflare();

export const solanaService = {
  connect: async (retryAttempts = 3, retryDelay = 1000) => {
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        await wallet.connect();
        const publicKey = wallet.publicKey?.toString();

        if (!publicKey) {
          throw new Error("Failed to connect wallet");
        }

        // Get initial balance
        const balance = await solanaService.getBalance(publicKey);

        return {
          address: publicKey,
          balance,
        };
      } catch (error) {
        console.error(
          `Attempt ${attempt}: Error connecting to Solana wallet:`,
          error,
        );

        // If this is the last attempt or we have a defined error, throw it
        if (attempt === retryAttempts || error !== undefined) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        console.log(
          `Retrying connection... Attempt ${attempt + 1}/${retryAttempts}`,
        );
      }
    }
  },

  disconnect: async () => {
    try {
      await wallet.disconnect();
      return true;
    } catch (error) {
      console.error("Error disconnecting from Solana wallet:", error);
      throw error;
    }
  },

  getBalance: async (address: string) => {
    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);

      // Convert lamports to SOL with 6 decimal places
      return (balance / LAMPORTS_PER_SOL).toFixed(6);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      throw error;
    }
  },

  sendSol: async (fromAddress: string, toAddress: string, amount: number) => {
    try {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error("Wallet is not connected");
      }

      const fromPubkey = new PublicKey(fromAddress);
      const toPubkey = new PublicKey(toAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Sign and send transaction using the SDK
      const signedTx = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
      );
      await connection.confirmTransaction(signature);

      return signature;
    } catch (error) {
      console.error("Error sending SOL:", error);
      throw error;
    }
  },
};
