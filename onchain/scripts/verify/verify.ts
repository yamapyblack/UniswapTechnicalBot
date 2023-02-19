import { Addresses, Verify } from "../common";

const main = async () => {
  const a = Addresses()!;
  const accessorAddr = "";

  await Verify(accessorAddr, [a.Router, a.Weth, a.Usdc]);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
