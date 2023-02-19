import { ethers } from "hardhat";
import { Addresses } from "../common";

async function main() {
  const a = Addresses()!;

  const Accessor = await ethers.getContractFactory("UniswapRouterAccessor");
  const c0 = await Accessor.deploy(a.Router, a.Weth, a.Usdc);
  await c0.deployed();
  console.log("deployed to:", c0.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
