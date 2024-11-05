import * as bitcoin from "bitcoinjs-lib";
import {
  BitcoinAccount,
  BitcoinWalletProvider,
  PhantomBitcoinProvider,
} from "./types";

export class PhantomWallet implements BitcoinWalletProvider {
  private provider: PhantomBitcoinProvider | null = null;

  private async getProvider(): Promise<PhantomBitcoinProvider | null> {
    if ("phantom" in window) {
      const provider = window.phantom?.bitcoin;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  }

  async connect(): Promise<{ address: string }> {
    this.provider = await this.getProvider();
    if (!this.provider) {
      throw new Error("Phantom wallet not available");
    }

    const accounts = await this.provider.requestAccounts();
    console.log("this.provider", this.provider);

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned");
    }

    const paymentAccount = accounts.find(
      (acc: BitcoinAccount) => acc.purpose === "payment",
    );
    if (!paymentAccount) {
      throw new Error("No payment address found");
    }

    return { address: paymentAccount.address };
  }

  async getBalance(): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    const accounts = await this.provider.requestAccounts();
    const paymentAccount = accounts.find(
      (acc: BitcoinAccount) => acc.purpose === "payment",
    );

    if (!paymentAccount) {
      throw new Error("No payment address found");
    }

    const response = await fetch(
      `https://blockstream.info/api/address/${paymentAccount.address}`,
    );
    const data = await response.json();
    return (
      Number(data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) /
      100000000
    ).toString();
  }

  async signMessage(message: string, address: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    const messageBytes = new TextEncoder().encode(message);
    const { signature } = await this.provider.signMessage(
      address,
      messageBytes,
    );
    return Buffer.from(signature).toString("base64");
  }

  async sendBitcoin(
    recipientAddress: string,
    amountInSats: number,
  ): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected");
    }

    // Get sender's payment account
    const accounts = await this.provider.requestAccounts();
    const paymentAccount = accounts.find(
      (acc: BitcoinAccount) => acc.purpose === "payment",
    );

    if (!paymentAccount) {
      throw new Error("No payment address found");
    }

    // Fetch UTXOs from a public API (using Blockstream's API)
    const response = await fetch(
      `https://blockstream.info/api/address/${paymentAccount.address}/utxo`,
    );
    const utxos = await response.json();

    if (!utxos || utxos.length === 0) {
      throw new Error("No UTXOs available");
    }

    // Create a new PSBT
    const network = bitcoin.networks.bitcoin;
    const psbt = new bitcoin.Psbt({ network });

    let totalInput = 0;

    // Add inputs from UTXOs
    for (const utxo of utxos) {
      // Get the full transaction to get the output script
      const txResponse = await fetch(
        `https://blockstream.info/api/tx/${utxo.txid}/hex`,
      );
      const txHex = await txResponse.text();
      const tx = bitcoin.Transaction.fromHex(txHex);

      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: tx.outs[utxo.vout].script,
          value: BigInt(utxo.value),
        },
      });
      totalInput += utxo.value;
    }

    // Add recipient output
    psbt.addOutput({
      address: recipientAddress,
      value: BigInt(amountInSats),
    });

    // Calculate and add change output
    const fee = 500; // Set appropriate fee calculation
    const changeAmount = totalInput - amountInSats - fee;

    if (changeAmount < 0) {
      throw new Error("Insufficient funds including fee");
    }

    if (changeAmount > 546) {
      // Add dust limit check
      psbt.addOutput({
        address: paymentAccount.address,
        value: BigInt(changeAmount),
      });
    }

    // Convert PSBT to base64
    const psbtBase64 = psbt.toBase64();

    // Convert base64 to bytes for Phantom
    const psbtBytes = new Uint8Array(Buffer.from(psbtBase64, "base64"));

    // Sign the PSBT using Phantom
    const signedPsbtBytes = await this.provider.signPSBT(psbtBytes, {
      inputsToSign: utxos.map(
        (_: { txid: string; vout: number; value: number }, index: number) => ({
          address: paymentAccount.address,
          signingIndexes: [index],
        }),
      ),
    });

    // Convert signed PSBT back to hex
    const signedPsbtHex = Buffer.from(signedPsbtBytes).toString("hex");

    // Broadcast the transaction using a public API
    const broadcastResponse = await fetch("https://blockstream.info/api/tx", {
      method: "POST",
      body: signedPsbtHex,
    });

    if (!broadcastResponse.ok) {
      throw new Error("Failed to broadcast transaction");
    }

    const txId = await broadcastResponse.text();
    return txId;
  }

  async disconnect(): Promise<void> {
    this.provider = null;
  }
}
