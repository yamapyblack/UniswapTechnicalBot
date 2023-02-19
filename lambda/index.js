const abi = [
  "function hasPosition() external view returns (bool)",
  "function buyUsdcAmount() external view returns (uint256)",
  "function balanceOf(address) external view returns (uint256)",
  "function buy(uint256, uint256) external returns (uint256)",
  "function sell(uint256, uint256) external returns (uint256)",
];

const oneday = 24 * 60 * 60 * 1000;

const parameters = {
  // usdcAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  wethAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  coinmarketcapUrl:
    "https://pro-api.coinmarketcap.com/v1/tools/price-conversion",
};

// exports.handler = async (event) => {
main = async () => {
  const axios = require("axios");
  const ethers = require("ethers");

  const privKey = process.env.PRIV_KEY;
  const coinmarketcapKey = process.env.COINMARKETCAP_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const rpcUrl = process.env.ARB_URL;

  // =============== get avrage price ===============
  const today = new Date();
  const headers = {
    Accepts: "application/json",
    "X-CMC_PRO_API_KEY": coinmarketcapKey,
  };

  let days4 = [];
  let days20 = [];
  //get latest 5 days price
  for (let i = 0; i < 5; i++) {
    const time = new Date(today.getTime() - i * oneday);
    const params = {
      symbol: "ETH",
      convert: "USD",
      amount: 1,
      time: time,
    };

    let response = await axios.get(parameters.coinmarketcapUrl, {
      params,
      headers: headers,
    });

    const json = response.data;
    // console.log(json);
    const price = json.data.quote.USD.price;
    console.log(price);
    days4.push(price);
  }
  console.log(calcAvg(days4), "days4");

  days20.push(days4[0]);
  days20.push(days4[4]);
  //get 10 days ago, 15 days ago, 20 days ago price
  for (let i = 2; i < 5; i++) {
    const time = new Date(today.getTime() - 5 * i * oneday);
    const params = {
      symbol: "ETH",
      convert: "USD",
      amount: 1,
      time: time,
    };

    let response = await axios.get(parameters.coinmarketcapUrl, {
      params,
      headers: headers,
    });

    const json = response.data;
    // console.log(json);
    const price = json.data.quote.USD.price;
    console.log(price);
    days20.push(price);
  }
  console.log(calcAvg(days20), "days20");

  // =============== Connect to Ethereum network ===============
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  // const usdc = new ethers.Contract(parameters.usdcAddress, abi, wallet);
  const weth = new ethers.Contract(parameters.wethAddress, abi, wallet);

  const _hasPosition = await contract.hasPosition();
  console.log(_hasPosition, "_hasPosition");

  const deadlineSecond = 300; // 5min
  const _deadline = Math.floor((Date.now() + deadlineSecond * 1000) / 1000);
  console.log(_deadline, "_deadline");

  const currentPrice = days4[0];
  console.log(currentPrice, "currentPrice");

  //compare MA 4 and MA 20
  // or 20% loss before yesterday
  if (
    _hasPosition &&
    (calcAvg(days4) < calcAvg(days20) || days4[0] < days4[1] * 0.8)
  ) {
    console.log("dead cross");

    const _wethBalance = await weth.balanceOf(contractAddress);
    console.log(_wethBalance.toString(), "_wethBalance");

    //_wethBalance * currentPrice * 0.96
    //slippage 4%
    const _amountOutMinimum = _wethBalance
      .mul(ethers.BigNumber.from(Math.floor(currentPrice)))
      .div(ethers.BigNumber.from("10").pow(12))
      .mul(ethers.BigNumber.from("48"))
      .div(ethers.BigNumber.from("50"));
    console.log(_amountOutMinimum.toString(), "_amountOutMinimum");

    const tx = await contract.sell(_amountOutMinimum, _deadline);
    console.log("tx", tx);
  } else if (!_hasPosition && calcAvg(days4) > calcAvg(days20)) {
    console.log("golden cross");

    const _buyUsdcAmount = await contract.buyUsdcAmount();
    console.log(_buyUsdcAmount.toString(), "_buyUsdcAmount");

    //_buyUsdcAmount / currentPrice * 0.96
    //slippage 4%
    const _amountOutMinimum = _buyUsdcAmount
      .div(ethers.BigNumber.from(Math.floor(currentPrice)))
      .mul(ethers.BigNumber.from("10").pow(12))
      .mul(ethers.BigNumber.from("48"))
      .div(ethers.BigNumber.from("50"));
    console.log(_amountOutMinimum.toString(), "_amountOutMinimum");

    const tx = await contract.buy(_amountOutMinimum, _deadline);
    console.log("tx", tx);
  }
};

const calcAvg = (arr) => {
  let sum = 0;
  arr.forEach(function (val) {
    sum += val;
  });
  return sum / arr.length;
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
