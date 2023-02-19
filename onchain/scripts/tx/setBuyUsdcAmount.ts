import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { MAX_UINT256 } from "../common";

async function main() {
  const accessorAddr = "";
  let tx;
  const accessor = await ethers.getContractAt("UniswapRouterAccessor", accessorAddr);

  tx = await accessor.setBuyUsdcAmount(20_000_000);
  tx.wait();
  console.log("tx", tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
