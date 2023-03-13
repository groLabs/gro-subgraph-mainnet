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
    } else {
        log.warning(
            'setGVaultDebt(): debt on non-existing strategy {} in /setters/stratsGVault.ts',
            [strategyAddress.toHexString()]
        );
    }
}

// @dev: triggered by GVault->`LogStrategyHarvestReport`
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
    } else {
        log.warning(
            'setStopLossLogic(): stopLoss on non-existing strategy {} in /setters/stratsGVault.ts',
            [strategyAddress.toHexString()]
        );
    }
}
