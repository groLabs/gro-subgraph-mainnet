import { contracts } from '../../addresses';
import {
    Num,
    Addr,
    Token,
    TxType,
} from '../types/constants';
import {
    Bytes,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


// Blocks
export const GRO_WETH_POOL_START_BLOCK = 13355180;  // Oct-04-2021 10:03:33 PM
export const G2_START_BLOCK = 16697425  // Feb-24-2023 09:51:35 AM

// Timestamps
export const TS_LAUNCH = 1622204347;    // Friday 28 May 2021 12:19:07

// Tokens
export const TOKEN: Token = {
    UNKNOWN: 'unknown',
	PWRD: 'pwrd',
	GVT: 'gvt',
	GRO: 'gro',
	DAI: 'dai',
	USDC: 'usdc',
	USDT: 'usdt',
    THREE_CRV: '3crv',
	UNISWAP_GVT_GRO: 'uniswap_gvt_gro',
	UNISWAP_GRO_USDC: 'uniswap_gro_usdc',
	CURVE_PWRD3CRV: 'curve_pwrd3crv',
	BALANCER_GRO_WETH: 'balancer_gro_weth',
}

// Transaction types
export const TX_TYPE: TxType = {
    CORE_DEPOSIT: 'core_deposit',
	CORE_WITHDRAWAL: 'core_withdrawal',
	STAKER_DEPOSIT: 'staker_deposit',
	STAKER_WITHDRAWAL: 'staker_withdrawal',
	TRANSFER_IN: 'transfer_in',
	TRANSFER_OUT: 'transfer_out',
	CLAIM: 'claim',
	MULTICLAIM: 'multiclaim',
	VEST: 'vest',
	APPROVAL: 'approval',
}

// Numbers
export const DECIMALS = 7;
export const NO_POOL = -1;
export const NUM_POOLS = 7;
export const NUM: Num = {
    ZERO: BigDecimal.fromString('0'),
    ONE: BigDecimal.fromString('1'),
    MINUS_ONE: BigDecimal.fromString('-1'),
    THIRTY_PERCENT: BigDecimal.fromString('0.3'),
    GVT_START_FACTOR: BigDecimal.fromString('0.005'),
    PWRD_START_FACTOR: BigDecimal.fromString('1'),
}

// Addresses
export const ADDR: Addr = {
    ZERO: Bytes.fromHexString('0x0000000000000000000000000000000000000000'),
}

// Pool ids
export const BALANCER_GRO_WETH_POOLID = Bytes.fromHexString(
    '0x702605f43471183158938c1a3e5f5a359d7b31ba00020000000000000000009f'
);

// Groups of contract addresses
export const STAKER_ADDRESSES = [
    Address.fromString(contracts.LpTokenStakerV1Address),
    Address.fromString(contracts.LpTokenStakerV2Address),
];
export const DEPOSIT_HANDLER_ADDRESSES = [
    Address.fromString(contracts.DepositHandlerV1Address),
    Address.fromString(contracts.DepositHandlerV2Address),
    Address.fromString(contracts.DepositHandlerV3Address),
];

export const WITHDRAWAL_HANDLER_ADDRESSES = [
    Address.fromString(contracts.WithdrawHandlerV1Address),
    Address.fromString(contracts.WithdrawHandlerV2Address),
    Address.fromString(contracts.WithdrawHandlerV3Address),
];

// Function signatures
export const ERC20_TRANSFER_SIG = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
export const LOG_WITHDRAWAL_SIG_V1 = '0x689bb63474b1590d4af4604d8f614b11b86fc5ae0a73cd6352e2f79adce66407';
export const LOG_WITHDRAWAL_SIG_V23 = '0x64801196bdd255d4dd88bfd3e78324c2d63634b67e53e04166db348f7cd96490';
export const LOG_DEPOSIT_SIG_V1 = '0x8bad9850b3d2edc5660781f45a304359a1ad12bfd16a0c6333f86b9ff55be0a1';
export const LOG_DEPOSIT_SIG_V23 = '0x106d567c81498246019397cc04d5ce37ba76461ce2c881c06a2097b13b9b0fc9';
export const LOG_GROUTER_DEPOSIT_SIG = '0x9a4b99f3a081eab47b3c79910ca7f945acda5b3ffc756c21d14be801f72e1ba7';
export const LOG_GROUTER_LEGACY_DEPOSIT_SIG = '0x6b21c5a0be8cebacb36975d57ab1090e8931a522b2572ad17fa1c0173725d623';
export const LOG_DEPOSIT_STAKER_SIG = '0x9dbb0e7dda3e09710ce75b801addc87cf9d9c6c581641b3275fca409ad086c62';
export const LOG_WITHDRAW_STAKER_SIG = '0xda9a10d7b992511ddadbfc7ff712c1424ce2058bbcdac8c9876d6f8de590d43f';
