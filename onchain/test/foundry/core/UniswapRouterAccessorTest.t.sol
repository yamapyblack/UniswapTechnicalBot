// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "../AddressHelper.sol";
import {UniswapRouterAccessor, SafeERC20, IERC20, ISwapRouter} from "../../../contracts/core/UniswapRouterAccessor.sol";

// import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UniswapRouterAccessorMock is UniswapRouterAccessor {
    using SafeERC20 for IERC20;

    constructor(
        address _router,
        address _weth,
        address _usdc
    ) UniswapRouterAccessor(_router, _weth, _usdc) {}

    function swap(
        bool _isBuy,
        uint256 _amountIn,
        uint256 _amountOutMinimum,
        uint256 _deadline
    ) external returns (uint256) {
        return _swap(_isBuy, _amountIn, _amountOutMinimum, _deadline);
    }
}

contract UniswapRouterAccessorTest is Test {
    using stdStorage for StdStorage;
    address alice = vm.addr(1);
    address bob = vm.addr(2);

    AddressHelper.TokenAddr public tokenAddr;
    AddressHelper.UniswapAddr public uniswapAddr;
    IERC20 weth;
    IERC20 usdc;
    ISwapRouter router;
    UniswapRouterAccessorMock access;

    function setUp() public {
        (tokenAddr, uniswapAddr) = AddressHelper.addresses(block.chainid);

        router = ISwapRouter(uniswapAddr.routerAddr); //for test
        weth = IERC20(tokenAddr.wethAddr);
        usdc = IERC20(tokenAddr.usdcAddr);
        access = new UniswapRouterAccessorMock(address(router), address(weth), address(usdc));

        //deal
        deal(tokenAddr.usdcAddr, alice, 10_000_000 * 1e6);

        //transferNFT
        access.transferFrom(address(this), alice, access.tokenId());

        //approve
        vm.startPrank(alice);
        usdc.approve(address(access), type(uint256).max);
        vm.stopPrank();
    }

    /* ========== MODIFIER ========== */
    function test_onlyOwner() public {
        vm.startPrank(alice);
        vm.expectRevert("UNAUTHORIZED");
        access.setFee(1000);
        vm.expectRevert("UNAUTHORIZED");
        access.setBuyUsdcAmount(1000);
        vm.expectRevert("UNAUTHORIZED");
        access.buy(1000, 1000);
        vm.expectRevert("UNAUTHORIZED");
        access.sell(1000, 1000);
        vm.stopPrank();
    }

    function test_onlyNftOwner() public {
        vm.startPrank(address(this));
        vm.expectRevert("only nft owner");
        access.deposit(1000);
        vm.expectRevert("only nft owner");
        access.withdraw(1000);
        vm.expectRevert("only nft owner");
        access.withdrawWeth(1000);
        vm.stopPrank();
    }

    function test_swap() public {
        vm.prank(alice);
        access.deposit(2000 * 1e6);
        console2.log(usdc.balanceOf(address(access)), "usdc.balanceOf(address(access))");
        console2.log(weth.balanceOf(address(access)), "weth.balanceOf(address(access))");

        access.swap(true, 2000 * 1e6, 1 ether, block.timestamp + 10 minutes);
        console2.log(usdc.balanceOf(address(access)), "usdc.balanceOf(address(access))");
        console2.log(weth.balanceOf(address(access)), "weth.balanceOf(address(access))");

        access.swap(false, 1 ether, 1600 * 1e6, block.timestamp + 10 minutes);
        console2.log(usdc.balanceOf(address(access)), "usdc.balanceOf(address(access))");
        console2.log(weth.balanceOf(address(access)), "weth.balanceOf(address(access))");
    }

    function test_buyAndSell() public {
        vm.prank(alice);
        access.deposit(2000 * 1e6);

        access.buy(1 ether, block.timestamp + 10 minutes);
        console2.log(usdc.balanceOf(address(access)), "usdc.balanceOf(address(access))");
        console2.log(weth.balanceOf(address(access)), "weth.balanceOf(address(access))");

        access.sell(1800 * 1e6, block.timestamp + 10 minutes);
        console2.log(usdc.balanceOf(address(access)), "usdc.balanceOf(address(access))");
        console2.log(weth.balanceOf(address(access)), "weth.balanceOf(address(access))");
    }
}
