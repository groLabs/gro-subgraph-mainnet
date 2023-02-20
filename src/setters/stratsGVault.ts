import { initGVault } from './gvault';
import { NUM } from '../utils/constants';
import { getGVaultStrategies } from '../utils/strats';
import {
    GVaultHarvest,
    GVaultStrategy
} from '../../generated/schema';
import {
    BigInt,
    Address,
    BigDecimal
} from '@graphprotocol/graph-ts';


const noGVaultStrategy = (): GVaultStrategy => {
    let strat = new GVaultStrategy('0x');
    strat.coin = 'unknown';
    strat.metacoin = 'unknown';
    strat.protocol = 'unknown';
    strat.strat_name = 'unknown';
    strat.strat_display_name = 'unknown';
    strat.vault_name = 'unknown';
    strat.vault_display_name = 'unknown';
    strat.vault_address ='0x';
    strat.strategy_debt = NUM.ZERO;
    strat.block_strategy_reported = 0;
    strat.block_strategy_withdraw = 0;
    return strat;
}

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
            strat.block_strategy_reported = 0;
            strat.block_strategy_withdraw = 0;
            strat.save();
        }
    }
}

export const initGVaultStrategy = (stratAddress: string): GVaultStrategy => {
    let strat = GVaultStrategy.load(stratAddress);
    if (!strat) {
        const strats = getGVaultStrategies();
        for (let i = 0; i < strats.length; i++) {
            const str = strats[i];
            if (str.active && str.id == stratAddress) {
                strat = new GVaultStrategy(str.id);
                strat.coin = str.coin;
                strat.metacoin = str.metacoin;
                strat.protocol = str.protocol;
                strat.strat_name = str.strat_name;
                strat.strat_display_name = str.strat_display_name;
                strat.vault_name = str.vault_name;
                strat.vault_display_name = str.vault_display_name;
                strat.vault_address = str.vault;
                strat.strategy_debt = NUM.ZERO;
                strat.block_strategy_reported = 0;
                strat.block_strategy_withdraw = 0;
                return strat;
            }
        }
        return noGVaultStrategy();
    }
    return strat;
}

export const setGVaultDebt = (
    strategyAddress: Address,
    eventType: string,
    strategyDebt: BigDecimal,
    blockTs: BigInt,
): void => {
    const id = strategyAddress.toHexString();
    let strat = initGVaultStrategy(id);
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

// @dev: triggered by GVault->`LogStrategyHarvestReport`
export const setGVaultLockedProfit = (
    vaultAddress: Address,
    lockedProfit: BigDecimal,
    block: BigInt,
): void => {
    let vault = initGVault(vaultAddress);
    vault.locked_profit = lockedProfit;
    vault.locked_profit_timestamp = block.toI32();
    vault.save();
}

// @dev: triggered by GVault->`LogStrategyHarvestReport`
export const setGVaultHarvest = (
    id: string,
    strategyAddress: string,
    gain: BigDecimal,
    loss: BigDecimal,
    debtPaid: BigDecimal,
    debtAdded: BigDecimal,
    lockedProfit: BigDecimal,
    excessLoss: BigDecimal,
    timestamp: BigInt,
): GVaultHarvest => {
    let harvest = GVaultHarvest.load(id);
    if (!harvest) {
        harvest = new GVaultHarvest(id);
        harvest.strategyAddress = strategyAddress;
        harvest.gain = gain;
        harvest.loss = loss;
        harvest.debtPaid = debtPaid;
        harvest.debtAdded = debtAdded;
        harvest.lockedProfit = lockedProfit;
        harvest.excessLoss = excessLoss;
        harvest.timestamp = timestamp.toI32();
        harvest.save();
    }
    return harvest;
}
