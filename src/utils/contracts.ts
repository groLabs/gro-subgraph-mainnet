import { contracts } from '../../addresses';
import { Address } from '@graphprotocol/graph-ts';
import { STAKER_ADDRESSES } from '../utils/constants';


// check if Transfer is a deposit or withdrawal
export const isDepositOrWithdrawal = (
    from: Address,
    to: Address,
): bool => {
    return (from == Address.zero() || to == Address.zero())
        ? true
        : false;
}

// check if Transfer comes in or out of a staker contract
export const isStakerTransfer = (
    from: Address,
    to: Address,
): bool => {
    return (STAKER_ADDRESSES.includes(from) || STAKER_ADDRESSES.includes(to))
        ? true
        : false;
}

export const isTransferToGRouter = (to: Address): bool => {
    return  gRouterAddress.equals(to);
}

// contract addresses
// Gro Protocol
export const gvtAddress = Address.fromString(contracts.GvtAddress);
export const pwrdAddress = Address.fromString(contracts.PwrdAddress);
export const vesting1Address = Address.fromString(contracts.VestingV1Address);
export const vesting2Address = Address.fromString(contracts.VestingV2Address);
export const staker1Address = Address.fromString(contracts.LpTokenStakerV1Address);
export const staker2Address = Address.fromString(contracts.LpTokenStakerV2Address);
export const threePoolAddress = Address.fromString(contracts.ThreePoolAddress);
export const uni2GvtGroAddress = Address.fromString(contracts.UniswapV2GvtGroAddress);
export const uni2GroUsdcAddress = Address.fromString(contracts.UniswapV2GroUsdcAddress);
export const uni2UsdcWethAddress = Address.fromString(contracts.UniswapV2UsdcWethAddress);
export const curveMetapoolAddress = Address.fromString(contracts.CurveMetapool3CRVAddress);
export const balGroWethVaultAddress = Address.fromString(contracts.BalancerGroWethVaultAddress);
export const balGroWethPoolAddress = Address.fromString(contracts.BalancerGroWethPoolAddress);
export const chainlinkDaiUsdAddress = Address.fromString(contracts.ChainlinkDaiUsdAddress);
export const chainlinkUsdcUsdAddress = Address.fromString(contracts.ChainlinkUsdcUsdAddress);
export const chainlinkUsdtUsdAddress = Address.fromString(contracts.ChainlinkUsdtUsdAddress);
// G^2
export const gVaultAddress = Address.fromString(contracts.GVaultAddress);
export const gRouterAddress = Address.fromString(contracts.GRouterAddress);
export const gTrancheAddress = Address.fromString(contracts.GTrancheAddress);