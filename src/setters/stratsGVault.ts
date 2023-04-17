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
///     - Initialises entity <GVaultStrategy> and updates debt, equilibrium value & health threshold
///     - Stores harvests' gain, loss, debt paid, debt added and locked profit in entity <GVaultHarvest>

import { NUM } from '../utils/constants';
import { getGVaultStrategies } from '../utils/strats';
import {
    GVaultHarvest,
    GVaultStrategy
} from '../../generated/schema';
import {
    log,
    Bytes,
    BigInt,
    BigDecimal
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <GVaultStrategy> with default values
/// @dev
///  - Static data for strategies is defined at /utils/strats.ts->getGVaultStrategies()
///  - This function is called once through /setters/masterdata.ts->initMasterDataOnce()
export const initAllGVaultStrategies = (): void => {
    const strats = getGVaultStrategies();
    for (let i = 0; i < strats.length; i++) {
        const str = strats[i];
        if (str.active) {
            let strat = new GVaultStrategy(str.id);
            strat.coin = str.coin;
            strat.metacoin = str.metacoin;
            strat.protocol = str.protocol;
            strat.strat_name = str.strat_name;
            strat.strat_display_name = str.strat_display_name;
            strat.vault_name = str.vault_name;
            strat.vault_display_name = str.vault_display_name;
            strat.vault_address = str.vault;
            strat.strategy_debt = NUM.ZERO;
            strat.equilibrium_value = NUM.ZERO;
            strat.healthThreshold = 0;
            strat.block_strategy_reported = 0;
            strat.block_strategy_withdraw = 0;
            strat.save();
        }
    }
}

/// @notice Updates debt and timestamp in entity <GVaultStrategy>
/// @dev Triggered by <LogStrategyTotalChanges> and <LogWithdrawalFromStrategy>
///      events from GVault contract
/// @param strategyAddress the strategy address
/// @param eventType the event type (withdrawal, total_changes)
/// @param strategyDebt the strategy debt
/// @param blockTs the block timestamp of the withdrawal or total_changes tx
export const setGVaultDebt = (
    strategyAddress: Bytes,
    eventType: string,
    strategyDebt: BigDecimal,
    blockTs: BigInt,
): void => {
    let strat = GVaultStrategy.load(strategyAddress);
    if (strat) {
        if (eventType == 'withdrawal') {
            // Based on event <LogWithdrawalFromStrategy>
            strat.strategy_debt = strategyDebt;
            strat.block_strategy_withdraw = blockTs.toI32();
        } else if (eventType == 'total_changes') {
            // Based on event <LogStrategyTotalChanges>
            strat.strategy_debt = strategyDebt;
            strat.block_strategy_reported = blockTs.toI32();
        }
        strat.save();
    }
}

/// @notice Stores harvest events from GVault in entity <GVaultHarvest>
/// @dev Triggered by <LogStrategyHarvestReport> events from GVault contract
/// @param id the harvest identifier (transaction hash + log index)
/// @param strategyAddress the strategy address
/// @param gain the gain value
/// @param loss the loss value
/// @param debtPaid the debt value paid
/// @param debtAdded the debt value added
/// @param lockedProfit the locked profit
/// @param lockedProfitBeforeLoss the locked profit before loss
/// @param timestamp the block timestamp of the harvest transaction
/// @return harvest object from entity <GVaultHarvest>
export const setGVaultHarvest = (
    id: Bytes,
    strategyAddress: Bytes,
    gain: BigDecimal,
    loss: BigDecimal,
    debtPaid: BigDecimal,
    debtAdded: BigDecimal,
    lockedProfit: BigDecimal,
    lockedProfitBeforeLoss: BigDecimal,
    timestamp: BigInt,
): GVaultHarvest => {
    let harvest = GVaultHarvest.load(id);
    if (!harvest) {
        harvest = new GVaultHarvest(id);
        harvest.strategy_address = strategyAddress;
        harvest.gain = gain;
        harvest.loss = loss;
        harvest.debt_paid = debtPaid;
        harvest.debt_added = debtAdded;
        harvest.locked_profit = lockedProfit;
        harvest.locked_profit_before_loss = lockedProfitBeforeLoss;
        harvest.block_timestamp = timestamp.toI32();
        harvest.save();
    }
    return harvest;
}

/// @notice Updates equilibrium value & health threshold in entity <GVaultStrategy>
/// @dev Triggered by <LogStrategyUpdated> events from StopLossLogic contract
/// @param strategyAddress the strategy address
/// @param equilibriumValue the equilibrium value
/// @param healthThreshold the health threshold
export const setStopLossLogic = (
    strategyAddress: Bytes,
    equilibriumValue: BigDecimal,
    healthThreshold: i32,
): void => {
    let strat = GVaultStrategy.load(strategyAddress);
    if (strat) {
        strat.equilibrium_value = equilibriumValue;
        strat.healthThreshold = healthThreshold;
        strat.save();
    }
}
