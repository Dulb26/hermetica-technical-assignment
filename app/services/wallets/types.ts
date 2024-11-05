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

export interface LeatherProvider {
  request(
    method: string,
    params?: LeatherRequestParams,
  ): Promise<LeatherResponse>;
}

export type LeatherRequestParams = {
  message?: string;
  paymentType?: string;
  recipients?: Array<{ address: string; amount: string }>;
};

export type LeatherResponse = {
  result: {
    addresses?: Array<{ type: string; symbol: string; address: string }>;
    signature?: string;
    txid?: string;
  };
};
