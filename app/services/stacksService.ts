import { AppConfig, showConnect, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export const stacksService = {
  connect: async () => {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: "Hermetica Technical Assignment",
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => {
          const userData = userSession.loadUserData();
          resolve({
            address: userData.profile.stxAddress.mainnet,
            balance: null, // You might want to fetch balance separately
          });
        },
        onCancel: () => {
          reject(new Error("User cancelled connection"));
        },
        userSession,
      });
    });
  },

  disconnect: () => {
    userSession.signUserOut("/");
  },

  getBalance: async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mainnet.hiro.so/extended/v1/address/${address}/stx`,
      );
      const data = await response.json();
      return (data.balance / 1000000).toFixed(6); // Convert microSTX to STX
    } catch (error) {
      console.error("Error fetching STX balance:", error);
      throw error;
    }
  },
};
