import * as React from "react";
import { useState } from "react";
import { useWalletStore } from "../store/useWalletStore";
import * as Tooltip from "@radix-ui/react-tooltip";

export const BitcoinTransfer: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { transfer } = useWalletStore();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !address) return;

    setIsLoading(true);
    try {
      const amountInSats = Math.floor(parseFloat(amount) * 100000000);
      if (amountInSats < 1500) {
        throw new Error(
          "Amount must be at least 1500 satoshis (0.00001500 BTC)",
        );
      }
      const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
      if (!bitcoinAddressRegex.test(address)) {
        throw new Error("Invalid Bitcoin address format");
      }
      await transfer(
        "bitcoin",
        address,
        Math.floor(parseFloat(amount) * 100000000),
      );
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleTransfer} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Amount (BTC)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => {
              const value = Number(e.target.value).toFixed(8);
              setAmount(value);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 transition-all duration-200"
            placeholder="0.0"
            step="0.00000001"
            min="0"
            required
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Recipient Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 transition-all duration-200"
            placeholder="Enter Bitcoin address"
            required
          />
        </div>
      </div>

      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="submit"
              disabled={isLoading || !amount || !address}
              className={`
                w-full py-4 px-6 rounded-xl font-medium transition-all duration-300
                ${
                  isLoading || !amount || !address
                    ? "bg-blue-500/20 cursor-not-allowed text-blue-300"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                }
                shadow-lg shadow-blue-500/20
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                "Send Bitcoin"
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm max-w-xs leading-relaxed
                       shadow-lg animate-fadeIn z-50 border border-gray-800"
              sideOffset={5}
              side="top"
            >
              This will transfer {amount || "0"} BTC to the specified Bitcoin
              address. Minimum transfer amount is 1500 satoshis (0.00001500
              BTC).
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </form>
  );
};
