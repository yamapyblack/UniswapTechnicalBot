import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkAccountsConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
// import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";

const accounts = (): HttpNetworkAccountsConfig => {
  if (!process.env.PRIV_KEY) {
    return "remote";
  }
  return [process.env.PRIV_KEY!];
};

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    arb: {
      url: `${process.env.ARB_URL!}`,
      accounts: accounts(),
    },
  },
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
