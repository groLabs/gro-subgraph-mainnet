import {
    amountToUsd,
    tokenToDecimal
} from '../utils/tokens';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    getGVaultStrategies,
    getTotalAssetsStrat3crv,
} from '../utils/strats';
import {
    GVaultHarvest,
    GVaultStrategy
} from '../../generated/schema';
import {
    log,
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
    strat.total_assets_strategy = NUM.ZERO;
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
            strat.vault_address = Address.fromString(str.vault);
            strat.total_assets_strategy = NUM.ZERO;
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
                strat.vault_address = Address.fromString(str.vault);
                strat.total_assets_strategy = NUM.ZERO;
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

export const setGVaultStrategy = (
    strategyAddress: Address,
    eventType: string,
    debtPaid: BigDecimal,
    debtAdded: BigDecimal,
    strategyDebt: BigDecimal,
    block: BigInt,
): void => {
    const id = strategyAddress.toHexString();
    let strat = initGVaultStrategy(id);
    if (eventType == 'harvest') {
        strat.strategy_debt = strat.strategy_debt.minus(debtPaid).plus(debtAdded);
        strat.block_strategy_reported = block.toI32();
    } else if (eventType == 'withdraw') {
        strat.strategy_debt = strategyDebt;
        strat.block_strategy_withdraw = block.toI32();
    }
    const totalStrategyAssets = getTotalAssetsStrat3crv(strategyAddress);
    if (totalStrategyAssets.reverted) {
        log.error(
            `setGVaultStrategy(): try_strategies() on strategy {} reverted in /setters/stratsGVault.ts`,
            [strategyAddress.toHexString()]
        );
    } else {
        strat.total_assets_strategy = amountToUsd(
            '3crv',
            tokenToDecimal(totalStrategyAssets.value.getTotalDebt(), 18, DECIMALS)
        );
    }
    strat.save();
}

export const setGVaultHarvest = (
    id: string,
    strategyAddress: string,
    gain: BigDecimal,
    loss: BigDecimal,
    debtPaid: BigDecimal,
    debtAdded: BigDecimal,
    lockedProfit: BigDecimal,
    timestamp: BigInt,
): GVaultHarvest => {
    let harvest = GVaultHarvest.load(id);
    if (!harvest){
        harvest = new GVaultHarvest(id);
        harvest.strategyAddress = strategyAddress;
        harvest.gain = gain;
        harvest.loss = loss;
        harvest.debtPaid = debtPaid;
        harvest.debtAdded = debtAdded;
        harvest.lockedProfit = lockedProfit;
        harvest.timestamp = timestamp.toI32();
        harvest.save();
    }
    return harvest;
}

// export const setStrategyWithdraw = (
//     id: string,
//     strategyId: BigInt,
//     strategyDebt: BigDecimal,
//     totalVaultDebt: BigDecimal,
//     lossFromStrategyWithdrawal: BigDecimal,
//     timestamp: BigInt,
// ): StrategyWithdraw => {
//     let strategyAddress = Address.zero().toHexString();
//     let withdraw = StrategyWithdraw.load(id);
//     if(!withdraw){
//         withdraw = new StrategyWithdraw(id);
//         const strategyQueue = StrategyQueue.load(strategyId.toString());
//         if(strategyQueue){
//             strategyAddress = strategyQueue.strategyAddress.toHexString();
//         } else {
//             log.warning('Not found strategy address by {}', [strategyId.toString()])
//         }
        
//         withdraw.strategyAddress = strategyAddress;
//         withdraw.strategyId = strategyId.toI32();
//         withdraw.strategyDebt = strategyDebt;
//         withdraw.totalVaultDebt = totalVaultDebt;
//         withdraw.lossFromStrategyWithdrawal = lossFromStrategyWithdrawal;
//         withdraw.timestamp = timestamp.toI32();
//         withdraw.save();
//     }
//     return withdraw;
// }
