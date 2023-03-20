// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Contains contract-related util functions and address conversions

import { contracts } from '../../addresses';
import { Address } from '@graphprotocol/graph-ts';
import { STAKER_ADDRESSES } from '../utils/constants';


/// @notice Checks if Transfer is a deposit or withdrawal based on from/to addresses
/// @param from the from address
/// @param to the to address
/// @return - True if deposit (from = 0x) or withdrawal (to = 0x)
///         - False otherwise
export const isDepositOrWithdrawal = (
    from: Address,
    to: Address,
): bool => {
    return (from == Address.zero() || to == Address.zero())
        ? true
        : false;
}

/// @notice Checks if Transfer comes from Staker contract
/// @param from the from address
/// @param to the to address
/// @return - True if from or to is a Staker address
///         - False otherwise
export const isStakerTransfer = (
    from: Address,
    to: Address,
): bool => {
    return (STAKER_ADDRESSES.includes(from) || STAKER_ADDRESSES.includes(to))
        ? true
        : false;
}

/// @notice Checks if Transfer goes to the GRouter contract
/// @param to the to address
/// @return - True if from to is the GRouter address
///         - False otherwise
export const isTransferToGRouter = (to: Address): bool => {
    return  gRouterAddress.equals(to);
}

// Contract addresses conversion (from string to Address) 
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