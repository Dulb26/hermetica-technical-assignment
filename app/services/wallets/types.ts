export interface BitcoinWalletProvider {
  connect(): Promise<{ address: string }>;
  getBalance(): Promise<string>;
  signMessage(message: string, address: string): Promise<string>;
  sendBitcoin(recipientAddress: string, amountInSats: number): Promise<string>;
  disconnect(): Promise<void>;
}

export interface BitcoinAccount {
  address: string;
  purpose: string;
}

export interface PhantomBitcoinProvider {
  isPhantom: boolean;
  requestAccounts: () => Promise<Array<{ address: string; purpose: string }>>;
  signMessage: (
    address: string,
    message: Uint8Array,
  ) => Promise<{ signature: Uint8Array }>;
  signPSBT: (
    psbt: Uint8Array,
    options: {
      inputsToSign: { address: string; signingIndexes: number[] }[];
    },
  ) => Promise<Uint8Array>;
}