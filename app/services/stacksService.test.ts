import { beforeEach, describe, expect, it, vi } from "vitest";
import { stacksService } from "./stacksService";

// Mock @stacks/connect
vi.mock("@stacks/connect", () => ({
  AppConfig: vi.fn(() => ({
    /* AppConfig mock implementation */
  })),
  UserSession: vi.fn(() => ({
    loadUserData: vi.fn(() => ({
      profile: {
        stxAddress: {
          mainnet: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        },
      },
    })),
    signUserOut: vi.fn(),
  })),
  showConnect: vi.fn((options) => {
    // Simulate the connect flow by calling onFinish
    setTimeout(() => options.onFinish(), 0);
  }),
}));

describe("StacksService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    global.window = {
      location: {
        origin: "http://localhost:3000",
      },
    } as Window & typeof globalThis;
  });

  it("connects successfully", async () => {
    const result = await stacksService.connect();

    expect(result).toEqual({
      address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      balance: null,
    });
  });

  it("handles connection cancellation", async () => {
    // Override showConnect mock for this test
    const { showConnect } = await import("@stacks/connect");
    vi.mocked(showConnect).mockImplementationOnce((options) => {
      setTimeout(() => (options as { onCancel: () => void }).onCancel(), 0);
    });

    await expect(stacksService.connect()).rejects.toThrow(
      "User cancelled connection",
    );
  });

  it("gets balance successfully", async () => {
    const mockBalance = 1000000; // 1 STX
    const mockResponse = { balance: mockBalance };

    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const balance = await stacksService.getBalance(
      "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    );

    expect(balance).toBe("1.000000");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.mainnet.hiro.so/extended/v1/address/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/stx",
    );
  });

  it("handles balance fetch error", async () => {
    const mockError = new Error("Network error");
    global.fetch = vi.fn().mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      stacksService.getBalance("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"),
    ).rejects.toThrow(mockError);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching STX balance:",
      mockError,
    );

    consoleSpy.mockRestore();
  });
});
