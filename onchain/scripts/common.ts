import { BigNumber } from "ethers";
import env from "hardhat";

export const NilAddress = "0x0000000000000000000000000000000000000000";
export const MAX_UINT256 = BigNumber.from("2").pow(BigNumber.from("256")).sub(BigNumber.from("1"));

export interface AddressesType {
  Weth: string;
  Usdc: string;
  Router: string;
}

export const Addresses = () => {
  switch (env.network.name) {
    case "arb":
      return {
        Weth: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        Usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        Router: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      } as AddressesType;

    default:
      return undefined;
  }
};

export const Verify = async (address: string, args: any[]) => {
  try {
    await env.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message === "Missing or invalid ApiKey") {
      console.log("Skip verifing with", e.message);
      return;
    }
    if (e.message === "Contract source code already verified") {
      console.log("Skip verifing with", e.message);
      return;
    }
    throw e;
  }
};
