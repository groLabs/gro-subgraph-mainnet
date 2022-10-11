import {
    Bytes,
    Address,
    BigDecimal,
} from "@graphprotocol/graph-ts";

// BLOCKS
export const GENESIS_POOL_GRO_WETH = 13355180;  // Oct-04-2021 10:03:33 PM

// Timestamps
export const LAUNCH_TIMESTAMP = 1622204347; // Friday 28 May 2021 12:19:07

// Numbers
export const DECIMALS = 7;
export const ZERO = BigDecimal.fromString('0');
export const ONE = BigDecimal.fromString('1');
export const NO_POOL = -1;

// Addresses
export const NO_ADDR = Bytes.empty();
export const ZERO_ADDR = Address.fromString('0x0000000000000000000000000000000000000000');

// Contract addresses
export const GVT_ADDRESS = Address.fromString('0x3ADb04E127b9C0a5D36094125669d4603AC52a0c');
export const PWRD_ADDRESS = Address.fromString('0xF0a93d4994B3d98Fb5e3A2F90dBc2d69073Cb86b');
export const UNISWAPV2_GVT_GRO_ADDRESS = Address.fromString('0x2ac5bC9ddA37601EDb1A5E29699dEB0A5b67E9bB');
export const UNISWAPV2_GRO_USDC_ADDRESS = Address.fromString('0x21C5918CcB42d20A2368bdCA8feDA0399EbfD2f6');
export const UNISWAPV2_USDC_WETH_ADDRESS = Address.fromString('0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc');
export const CURVE_PWRD_3CRV_ADDRESS = Address.fromString('0xbcb91E689114B9Cc865AD7871845C95241Df4105');
export const BALANCER_GRO_WETH_VAULT_ADDRESS = Address.fromString('0xBA12222222228d8Ba445958a75a0704d566BF2C8');
export const BALANCER_GRO_WETH_POOL_ADDRESS = Address.fromString('0x702605F43471183158938C1a3e5f5A359d7b31ba');
export const STAKER_V1_ADDRESS = Address.fromString('0x001C249c09090D79Dc350A286247479F08c7aaD7');
export const STAKER_V2_ADDRESS = Address.fromString('0x2E32bAd45a1C29c1EA27cf4dD588DF9e68ED376C');
export const DEPOSIT_HANDLER_V1_ADDRESS = Address.fromString('0x79b14d909381D79B655C0700d0fdc2C7054635b9');
export const DEPOSIT_HANDLER_V2_ADDRESS = Address.fromString('0x9da6ad743F4F2A247A56350703A4B501c7f2C224');
export const DEPOSIT_HANDLER_V3_ADDRESS = Address.fromString('0xB7207Ea9446DcA1dEC1c1FC93c6Fcdf8B4a44F40');
export const CHAINLINK_DAI_USD_ADDRESS = Address.fromString('0xDEc0a100eaD1fAa37407f0Edc76033426CF90b82');
export const CHAINLINK_USDC_USD_ADDRESS = Address.fromString('0x789190466E21a8b78b8027866CBBDc151542A26C');
export const CHAINLINK_USDT_USD_ADDRESS = Address.fromString('0xa964273552C1dBa201f5f000215F5BD5576e8f93');

// export const DAI_ADDRESS = Address.fromString('0x6B175474E89094C44Da98b954EedeAC495271d0F');
// export const USDC_ADDRESS = Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
// export const USDT_ADDRESS = Address.fromString('0xdAC17F958D2ee523a2206206994597C13D831ec7');

// Pool ids
export const BALANCER_GRO_WETH_POOLID = Bytes.fromHexString('0x702605f43471183158938c1a3e5f5a359d7b31ba00020000000000000000009f');

// Groups of contract addresses
export const STAKER_ADDRESSES = [
    STAKER_V1_ADDRESS,
    STAKER_V2_ADDRESS,
];
export const DEPOSIT_HANDLER_ADDRESSES = [
    DEPOSIT_HANDLER_V1_ADDRESS,
    DEPOSIT_HANDLER_V2_ADDRESS,
    DEPOSIT_HANDLER_V3_ADDRESS,
];

// Function signatures
export const ERC20_TRANSFER_SIG = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';