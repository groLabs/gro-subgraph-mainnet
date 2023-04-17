// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Handles <LogStrategyAdded>, <LogNewReleaseFactor>, <LogStrategyTotalChanges>,
///       <LogStrategyHarvestReport> & <LogWithdrawalFromStrategy> events from GVault contract
/// @dev
///     - GVault: 0x1402c1caa002354fc2c4a4cd2b4045a5b9625ef3

import { setGvtPrice } from '../setters/price';
import { tokenToDecimal } from '../utils/tokens';
import { updateFactor } from '../setters/factors';
import { initMasterDataOnce } from '../setters/masterdata';
import { setUtilizationRatio } from '../setters/gtranche';
import {
    isActiveStrategy,
    getStrategyAddressByQueueId,
} from '../utils/strats';
import {
    NUM,
    ADDR,
    DECIMALS,
    TOKEN as Token,
} from '../utils/constants';
import {
    initGVault,
    setNewReleaseFactor,
    setGVaultLockedProfit,
} from '../setters/gvault';
import {
    setGVaultDebt,
    setGVaultHarvest,
} from '../setters/stratsGVault';
import {
    LogStrategyAdded,
    LogNewReleaseFactor,
    OwnershipTransferred,
    LogStrategyTotalChanges,
    LogStrategyHarvestReport,
    LogWithdrawalFromStrategy,
} from '../../generated/GVault/GVault';


/// @notice Handles <LogStrategyAdded> events from GVault contract
/// @param ev the strategy added event
/// @dev the Vault entity will be created when the first strategy is added
export function handleStrategyAdded(ev: LogStrategyAdded): void {
    // Stores the vault in entity <GVault>
    initGVault(ev.address);
}

/// @notice Handles <LogNewReleaseFactor> events from GVault contract
/// @param ev the new release factor event
export function handleLogNewReleaseFactor(ev: LogNewReleaseFactor): void {
    // Updates the release factor in entity <GVault>
    setNewReleaseFactor(
        ev.address,
        ev.params.factor.toI32(),
    );
}

/// @notice Handles <LogStrategyHarvestReport> events from GVault contract
/// @param ev the strategy harvest report event
export function handleStrategyHarvestReport(ev: LogStrategyHarvestReport): void {

    // Events from old strategies must be discarded
    const stratAddress = ev.params.strategy;
    if (isActiveStrategy(stratAddress)) {

        // Stores the harvest in entity <GVaultHarvest>
        const logIndex = ev.logIndex.toI32();
        const harvest = setGVaultHarvest(
            ev.transaction.hash.concatI32(logIndex),
            stratAddress,
            tokenToDecimal(ev.params.gain, 18, DECIMALS),
            tokenToDecimal(ev.params.loss, 18, DECIMALS),
            tokenToDecimal(ev.params.debtPaid, 18, DECIMALS),
            tokenToDecimal(ev.params.debtAdded, 18, DECIMALS),
            tokenToDecimal(ev.params.lockedProfit, 18, DECIMALS),
            tokenToDecimal(ev.params.lockedProfitBeforeLoss, 18, DECIMALS),
            ev.block.timestamp,
        );

        // Updates the locked profit & timestamp in entity <GVault>
        setGVaultLockedProfit(
            ev.address,
            harvest.locked_profit,
            ev.block.timestamp,
        );

        // Updates the gvt & pwrd factors in entity <Factor>
        updateFactor(Token.UNKNOWN);

        // Updates the gvt price in entity <Price>
        setGvtPrice();

        // Updates the utilisation ratio in entity <MasterData> via GTranche.utilisation()
        setUtilizationRatio(NUM.ZERO);
    }
}

/// @notice Handles <LogWithdrawalFromStrategy> events from GVault contract
/// @param ev the withdrawal from strategy event
export function handleWithdrawalFromStrategy(ev: LogWithdrawalFromStrategy): void {
    const queue = ev.params.strategyId.toI32();
    const strategyAddress = getStrategyAddressByQueueId(queue);
    if (strategyAddress != ADDR.ZERO) {
        // Updates the strategy debt & timestamp in entity <GVaultStrategy>
        setGVaultDebt(
            strategyAddress,
            'withdrawal',
            tokenToDecimal(ev.params.strategyDebt, 18, DECIMALS),
            ev.block.number,
        );
    }
}

/// @notice Handles <LogStrategyTotalChanges> events from GVault contract
/// @param ev the strategy total changes event
export function handleStrategyTotalChanges(ev: LogStrategyTotalChanges): void {
    // Updates the strategy debt & timestamp in entity <GVaultStrategy>
    const stratAddress = ev.params.strategy;
    if (isActiveStrategy(stratAddress)) {
        setGVaultDebt(
            stratAddress,
            'total_changes',
            tokenToDecimal(ev.params.totalDebt, 18, DECIMALS),
            ev.block.number,
        );
    }
}

/// @notice Handles <OwnershipTransferred> events from GVault contract
/// @dev No parameter is needed: this function is used to initialise Masterdata once
export function handleOwnershipTransferred(_: OwnershipTransferred): void {
    initMasterDataOnce();
}
