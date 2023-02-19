// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

library AddressHelper {
    uint256 constant MAINNET_ID = 1;
    uint256 constant ARB_ID = 42161;

    struct TokenAddr {
        address wethAddr;
        address usdcAddr;
    }
    struct UniswapAddr {
        address wethUsdcPoolAddr;
        address routerAddr;
    }

    function addresses(uint256 _chainid)
        internal
        pure
        returns (TokenAddr memory tokenAddr_, UniswapAddr memory uniswapAddr_)
    {
        if (_chainid == ARB_ID) {
            //arbitrum
            tokenAddr_ = TokenAddr({
                wethAddr: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1,
                usdcAddr: 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
            });
            uniswapAddr_ = UniswapAddr({
                wethUsdcPoolAddr: 0x17c14D2c404D167802b16C450d3c99F88F2c4F4d,
                routerAddr: 0xE592427A0AEce92De3Edee1F18E0157C05861564
            });
        }
    }
}
