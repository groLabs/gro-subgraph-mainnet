import {
    Bytes,
    Address,
    BigDecimal,
} from "@graphprotocol/graph-ts";
import {
    Num,
    Addr,
} from '../types/constants';

// Blocks
export const GENESIS_POOL_GRO_WETH = 13355180;  // Oct-04-2021 10:03:33 PM

// Timestamps
export const TS_LAUNCH = 1622204347;    // Friday 28 May 2021 12:19:07

// Numbers
export const DECIMALS = 7;
export const NO_POOL = -1;
export const NUM: Num = {
    ZERO: BigDecimal.fromString('0'),
    ONE: BigDecimal.fromString('1'),
    MINUS_ONE: BigDecimal.fromString('-1'),
    THIRTY_PERCENT: BigDecimal.fromString('0.3'),
    GVT_START_FACTOR: BigDecimal.fromString('0.005'),
    PWRD_START_FACTOR: BigDecimal.fromString('1'),
}

// Default addresses
export const NO_ADDR = Bytes.empty();

// Contract addresses
export const ADDR: Addr = {
    ZERO: Address.fromString('0x0000000000000000000000000000000000000000'),
    GVT: Address.fromString('0x3ADb04E127b9C0a5D36094125669d4603AC52a0c'),
    PWRD: Address.fromString('0xF0a93d4994B3d98Fb5e3A2F90dBc2d69073Cb86b'),
    UNISWAPV2_GVT_GRO: Address.fromString('0x2ac5bC9ddA37601EDb1A5E29699dEB0A5b67E9bB'),
    UNISWAPV2_GRO_USDC: Address.fromString('0x21C5918CcB42d20A2368bdCA8feDA0399EbfD2f6'),
    UNISWAPV2_USDC_WETH: Address.fromString('0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'),
    CURVE_PWRD_3CRV: Address.fromString('0xbcb91E689114B9Cc865AD7871845C95241Df4105'),
    BALANCER_GRO_WETH_VAULT: Address.fromString('0xBA12222222228d8Ba445958a75a0704d566BF2C8'),
    BALANCER_GRO_WETH_POOL: Address.fromString('0x702605F43471183158938C1a3e5f5A359d7b31ba'),
    STAKER_V1: Address.fromString('0x001C249c09090D79Dc350A286247479F08c7aaD7'),
    STAKER_V2: Address.fromString('0x2E32bAd45a1C29c1EA27cf4dD588DF9e68ED376C'),
    DEPOSIT_HANDLER_V1: Address.fromString('0x79b14d909381D79B655C0700d0fdc2C7054635b9'),
    DEPOSIT_HANDLER_V2: Address.fromString('0x9da6ad743F4F2A247A56350703A4B501c7f2C224'),
    DEPOSIT_HANDLER_V3: Address.fromString('0xB7207Ea9446DcA1dEC1c1FC93c6Fcdf8B4a44F40'),
    WITHDRAWAL_HANDLER_V1: Address.fromString('0xd89512Bdf570476310DE854Ef69D715E0e85B09F'),
    WITHDRAWAL_HANDLER_V2: Address.fromString('0x59B6b763509198d07cF8F13a2dc6F2df98CB0a1d'),
    WITHDRAWAL_HANDLER_V3: Address.fromString('0x641bEFA4dB601578A64F0Fc1f4E89E9869268Fe7'),
    CHAINLINK_DAI_USD: Address.fromString('0xDEc0a100eaD1fAa37407f0Edc76033426CF90b82'),
    CHAINLINK_USDC_USD: Address.fromString('0x789190466E21a8b78b8027866CBBDc151542A26C'),
    CHAINLINK_USDT_USD: Address.fromString('0xa964273552C1dBa201f5f000215F5BD5576e8f93'),
    GRO_VESTING_V1: Address.fromString('0xA28693bf01Dc261887b238646Bb9636cB3a3730B'),
    GRO_VESTING_V2: Address.fromString('0x748218256AfE0A19a88EBEB2E0C5Ce86d2178360')
}

// Pool ids
export const BALANCER_GRO_WETH_POOLID = Bytes.fromHexString('0x702605f43471183158938c1a3e5f5a359d7b31ba00020000000000000000009f');

// Groups of contract addresses
export const STAKER_ADDRESSES = [
    ADDR.STAKER_V1,
    ADDR.STAKER_V2,
];
export const DEPOSIT_HANDLER_ADDRESSES = [
    ADDR.DEPOSIT_HANDLER_V1,
    ADDR.DEPOSIT_HANDLER_V2,
    ADDR.DEPOSIT_HANDLER_V3,
];

export const WITHDRAWAL_HANDLER_ADDRESSES = [
    ADDR.WITHDRAWAL_HANDLER_V1,
    ADDR.WITHDRAWAL_HANDLER_V2,
    ADDR.WITHDRAWAL_HANDLER_V3,
];

// Function signatures
export const ERC20_TRANSFER_SIG = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
export const LOG_WITHDRAWAL_SIG_V1 = '0x689bb63474b1590d4af4604d8f614b11b86fc5ae0a73cd6352e2f79adce66407';
export const LOG_WITHDRAWAL_SIG_V23 = '0x64801196bdd255d4dd88bfd3e78324c2d63634b67e53e04166db348f7cd96490';
export const LOG_DEPOSIT_SIG_V1 = '0x8bad9850b3d2edc5660781f45a304359a1ad12bfd16a0c6333f86b9ff55be0a1';
export const LOG_DEPOSIT_SIG_V23 = '0x106d567c81498246019397cc04d5ce37ba76461ce2c881c06a2097b13b9b0fc9';

// Stablecoin approvals no needed for now (they kill performance!)
// export const DAI_ADDRESS = Address.fromString('0x6B175474E89094C44Da98b954EedeAC495271d0F');
// export const USDC_ADDRESS = Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
// export const USDT_ADDRESS = Address.fromString('0xdAC17F958D2ee523a2206206994597C13D831ec7');