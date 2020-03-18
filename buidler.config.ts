import { usePlugin } from "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-etherscan");

export default {
  paths: {
    artifacts: "./build"
  },
  networks: {
    ropsten: {
      url: process.env.INFURA_PROVIDER_URL_ROPSTEN,
      chainId: 3,
      accounts: {
        mnemonic: process.env.HDWALLET_MNEMONIC
      }
    }
  },
  etherscan: {
    url: "https://api-ropsten.etherscan.io/api",
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
