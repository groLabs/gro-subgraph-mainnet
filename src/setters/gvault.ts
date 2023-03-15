// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Updates the release factor & locked profit in entity <GVault>

import { NUM } from '../utils/constants';
import { GVault } from '../../generated/schema';
import {
    Bytes,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <GVault> with default values if not created yet
/// @param vaultAddress the vault address to be initialised or returned
/// @return GVault object for a given vault address
export const initGVault = (
    vaultAddress: Bytes,
): GVault => {
    let vault = GVault.load(vaultAddress);
    if (!vault) {
        vault = new GVault(vaultAddress);
        vault.release_factor = i32(86400);
        vault.locked_profit = NUM.ZERO;
        vault.locked_profit_timestamp = i32(0);
        vault.save();
    }
    return vault;
}

/// @notice Updates the new release factor in entity <GVault>
/// @dev Triggered by event <LogNewReleaseFactor> from GVault contract
/// @param vaultAddress the vault address
/// @param value the new release factor value to be updated
export const setNewReleaseFactor = (
    vaultAddress: Bytes,
    value: i32,
): void => {
    let vault = initGVault(vaultAddress);
    vault.release_factor = value;
    vault.save();
}

/// @notice Updates the locked profit in entity <GVault>
/// @dev Triggered by event <LogStrategyHarvestReport> from GVault contract
/// @param vaultAddress the vault address
/// @param lockedProfit the locked profit value
/// @param blockTimestamp the block timestamp at which the harvest was triggered
export const setGVaultLockedProfit = (
    vaultAddress: Bytes,
    lockedProfit: BigDecimal,
    blockTimestamp: BigInt,
): void => {
    let vault = initGVault(vaultAddress);
    vault.locked_profit = lockedProfit;
    vault.locked_profit_timestamp = blockTimestamp.toI32();
    vault.save();
}
