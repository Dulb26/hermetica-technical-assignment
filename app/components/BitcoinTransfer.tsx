import * as Tooltip from "@radix-ui/react-tooltip";
import * as React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useWalletStore } from "../store/useWalletStore";

export const BitcoinTransfer: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { transfer } = useWalletStore();

  const validateAmount = (value: string) => {
    const amountInSats = Math.floor(parseFloat(value) * 100000000);
    if (amountInSats < 1500) {
      toast.error("Amount must be at least 1500 satoshis (0.00001500 BTC)");
      return false;
    }
    return true;
  };

  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      validateAmount(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value).toFixed(8);
    setAmount(value);
  };

  const validateBitcoinAddress = (address: string) => {
    const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    if (!bitcoinAddressRegex.test(address)) {
      toast.error("Invalid Bitcoin address format");
      return false;
    }
    return true;
  };

  const handleAddressBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      validateBitcoinAddress(value);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
  };

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
      if (!validateBitcoinAddress(address)) {
        return;
      }
      await transfer("bitcoin", address, amountInSats);
      toast.success("Transfer completed successfully!");
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Transfer failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form role="form" className="space-y-8" onSubmit={handleTransfer}>
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
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 transition-all duration-200"
            placeholder="0.0"
            step="0.00000001"
            min="0"
            required
            data-testid="amount-input"
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
            onChange={handleAddressChange}
            onBlur={handleAddressBlur}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 transition-all duration-200"
            placeholder="Enter Bitcoin address"
            required
            data-testid="recipient-address-input"
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
