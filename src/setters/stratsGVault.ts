// import {
//     amountToUsd,
//     tokenToDecimal
// } from '../utils/tokens';
import {
    NUM,
    // DECIMALS,
} from '../utils/constants';
import {
    getGVaultStrategies,
    // getTotalAssetsStrat3crv,
} from '../utils/strats';
import {
    GVaultHarvest,
    GVaultStrategy
} from '../../generated/schema';
import {
    // log,
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
    strat.vault_address = Address.zero();
    strat.strategy_debt = NUM.ZERO;
    strat.locked_profit = NUM.ZERO;
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
            strat.vault_address = Address.fromString(str.vault);
            strat.strategy_debt = NUM.ZERO;
            strat.locked_profit = NUM.ZERO;
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
                strat.vault_address = Address.fromString(str.vault);
                strat.strategy_debt = NUM.ZERO;
                strat.locked_profit = NUM.ZERO;
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
    debtPaid: BigDecimal,
    debtAdded: BigDecimal,
    strategyDebt: BigDecimal,
    lockedProfit: BigDecimal,
    block: BigInt,
): void => {
    const id = strategyAddress.toHexString();
    let strat = initGVaultStrategy(id);
    if (eventType == 'harvest') {
        // Based on event LogStrategyHarvestReport
        strat.strategy_debt = strat.strategy_debt.minus(debtPaid).plus(debtAdded);
        strat.block_strategy_reported = block.toI32();
        strat.locked_profit = lockedProfit;
    } else if (eventType == 'withdrawal') {
        // Based on event LogWithdrawalFromStrategy
        strat.strategy_debt = strategyDebt;
        strat.block_strategy_withdraw = block.toI32();
    }
    strat.save();
}

// export const updateAllGVaultDebts = (): void => {
//     // Based on event Deposit or Withdraw
//     const strats = getGVaultStrategies();
//     for (let i = 0; i < strats.length; i++) {
//         const stratAddress = Address.fromString(strats[i].id)
//         const totalDebt = getTotalAssetsStrat3crv(stratAddress);
//         if (totalDebt.reverted) {
//             log.error(
//                 `updateAllGVaultDebts(): try_strategies() on strategy {} reverted in /setters/stratsGVault.ts`,
//                 [strats[i].id]
//             );
//         } else {
//             let strat = initGVaultStrategy(strats[i].id);
//             strat.strategy_debt = amountToUsd(
//                 '3crv',
//                 tokenToDecimal(totalDebt.value.getTotalDebt(), 18, DECIMALS)
//             );
//             strat.save();
//         }
//     }
// }

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
