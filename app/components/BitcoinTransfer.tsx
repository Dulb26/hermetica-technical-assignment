import React, { useState } from "react";
import { useWalletStore } from "../store/useWalletStore";

export const BitcoinTransfer: React.FC = () => {
  const { bitcoin } = useWalletStore();
  const [amount, setAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (!bitcoin.isConnected) {
        throw new Error("Please connect your Bitcoin wallet first");
      }

      if (!amount || !destinationAddress) {
        throw new Error("Please fill in all fields");
      }

      // Here you would typically integrate with your Bitcoin transfer logic
      // For now, we'll just simulate a transfer
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAmount("");
      setDestinationAddress("");
      alert("Transfer simulated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Transfer Bitcoin</h2>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount (BTC)
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
            disabled={!bitcoin.isConnected || isProcessing}
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination Address
          </label>
          <input
            id="address"
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Bitcoin address"
            disabled={!bitcoin.isConnected || isProcessing}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md font-medium text-white
            ${
              !bitcoin.isConnected || isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={!bitcoin.isConnected || isProcessing}
        >
          {isProcessing ? "Processing..." : "Transfer"}
        </button>
      </form>
    </div>
  );
};
