import {
    amountToUsd,
    tokenToDecimal
} from '../utils/tokens';
import {
    Harvest,
    Strategy,
    GVaultHarvest,
    GVaultStrategy
    // StrategyWithdraw,
    // StrategyQueue
} from '../../generated/schema';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import {
    getStrategies,
    getTotalAssetsVault,
    getTotalAssetsStrat,
    getAdapterAddressByStrategy,
} from '../utils/strats';
import {
    log,
    Address,
    BigInt,
    BigDecimal
} from '@graphprotocol/graph-ts';


const noStrategy = (): Strategy => {
    let strat = new Strategy('0x');
    strat.coin = 'unknown';
    strat.metacoin = 'unknown';
    strat.protocol = 'unknown';
    strat.strat_name = 'unknown';
    strat.strat_display_name = 'unknown';
    strat.vault_name = 'unknown';
    strat.vault_display_name = 'unknown';
    strat.vault_address = ADDR.ZERO;
    strat.vault_adapter_address = ADDR.ZERO;
    strat.total_assets_adapter = NUM.ZERO;
    strat.total_assets_strategy = NUM.ZERO;
    strat.strategy_debt = NUM.ZERO;
    strat.block_strategy_reported = 0;
    strat.block_hourly_update = 0;
    return strat;
}

const noGVaultStrategy = (): GVaultStrategy => {
    let strat = new GVaultStrategy('0x');
    strat.coin = 'unknown';
    strat.metacoin = 'unknown';
    strat.protocol = 'unknown';
    strat.strat_name = 'unknown';
    strat.strat_display_name = 'unknown';
    strat.vault_name = 'unknown';
    strat.vault_display_name = 'unknown';
    strat.vault_address = ADDR.ZERO;
    strat.total_assets_strategy = NUM.ZERO;
    strat.strategy_debt = NUM.ZERO;
    strat.block_strategy_reported = 0;
    strat.block_strategy_withdraw = 0;
    return strat;
}

export const initAllStrategies = (): void => {
    const strats = getStrategies();
    for (let i = 0; i < strats.length; i++) {
        const str = strats[i];
        if (str.active) {
            let strat = new Strategy(str.id);
            strat.coin = str.coin;
            strat.metacoin = str.metacoin;
            strat.protocol = str.protocol;
            strat.strat_name = str.strat_name;
            strat.strat_display_name = str.strat_display_name;
            strat.vault_name = str.vault_name;
            strat.vault_display_name = str.vault_display_name;
            strat.vault_address = Address.fromString(str.vault);
            strat.vault_adapter_address = Address.fromString(str.adapter);
            strat.total_assets_adapter = NUM.ZERO;
            strat.total_assets_strategy = NUM.ZERO;
            strat.strategy_debt = NUM.ZERO;
            strat.block_strategy_reported = 0;
            strat.block_hourly_update = 0;
            strat.save();
        }
    }
}

export const initStrategy = (stratAddress: string): Strategy => {
    let strat = Strategy.load(stratAddress);
    if (!strat) {
        const strats = getStrategies();
        for (let i = 0; i < strats.length; i++) {
            const str = strats[i];
            if (str.active && str.id == stratAddress) {
                strat = new Strategy(str.id);
                strat.coin = str.coin;
                strat.metacoin = str.metacoin;
                strat.protocol = str.protocol;
                strat.strat_name = str.strat_name;
                strat.strat_display_name = str.strat_display_name;
                strat.vault_name = str.vault_name;
                strat.vault_display_name = str.vault_display_name;
                strat.vault_address = Address.fromString(str.vault);
                strat.vault_adapter_address = Address.fromString(str.adapter);
                strat.total_assets_adapter = NUM.ZERO;
                strat.total_assets_strategy = NUM.ZERO;
                strat.strategy_debt = NUM.ZERO;
                strat.block_strategy_reported = 0;
                strat.block_hourly_update = 0;
                return strat;
            }
        }
        return noStrategy();
    }
    return strat;
}

export const initGVaultStrategy = (stratAddress: string): GVaultStrategy => {
    let strat = GVaultStrategy.load(stratAddress);
    if (!strat) {
        const strats = getStrategies();
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

// vault's strategy reported events
// @dev: updates vault amount & strategy amount
//       only if this function is triggered by an event, updates strategy debt
export const setStrategyReported = (
    vaultAddress: Address,
    strategyAddress: Address,
    totalDebt: BigInt,
    block: BigInt,
    coin: string,
    isStrategyReportedEvent: boolean,
): void => {
    const base = (coin === 'dai') ? 18 : 6;
    const id = strategyAddress.toHexString();
    let strat = initStrategy(id);
    const adapterAddress = getAdapterAddressByStrategy(id);
    if (adapterAddress != ADDR.ZERO) {
        const totalAssetsVault = getTotalAssetsVault(adapterAddress);
        const totalAssetsStrat = getTotalAssetsStrat(vaultAddress, strategyAddress);
        if (totalAssetsVault.reverted) {
            log.error(
                `strats.ts->setStrategyReported: totalAssets reverted for adapter {}`,
                [adapterAddress.toHexString()]
            );
        } else if (totalAssetsStrat.reverted) {
            log.error(
                `strats.ts->setStrategyReported: totalEstimatedAssets reverted for strategy {}`,
                [id]
            );
        } else {
            // strat.total_assets_adapter = tokenToDecimal(totalAssetsVault.value, base, DECIMALS);
            strat.total_assets_adapter = amountToUsd(
                coin,
                tokenToDecimal(totalAssetsVault.value, base, DECIMALS)
            );
            // strat.total_assets_strategy =  tokenToDecimal(totalAssetsStrat.value.getTotalDebt(), base, DECIMALS);
            strat.total_assets_strategy = amountToUsd(
                coin,
                tokenToDecimal(totalAssetsStrat.value.getTotalDebt(), base, DECIMALS)
            );
            if (isStrategyReportedEvent) {
                strat.strategy_debt = tokenToDecimal(totalDebt, base, DECIMALS);
                strat.block_strategy_reported = block.toI32();
            } else {
                strat.block_hourly_update = block.toI32();
            }
            strat.save();
        }
    } else {
        log.error(`strats.ts->setStrategyReportedDAI: strategy {} not found`,
            [strategyAddress.toHexString()]
        );
    }
}

export const updateAllStrategies = (block: BigInt): void => {
    const strats = getStrategies();
    for (let i = 0; i < strats.length; i++) {
        setStrategyReported(
            Address.fromString(strats[i].vault),
            Address.fromString(strats[i].id),
            BigInt.fromString('0'),
            block,
            strats[i].coin,
            false,
        );
    }
}

// strategies' harvest events
export const setStrategyHarvest = (
    id: string,
    strategyAddress: string,
    gain: BigDecimal,
    loss: BigDecimal,
    timestamp: BigInt,
): void => {
    let harvest = Harvest.load(id);
    if (!harvest) {
        harvest = new Harvest(id);
        harvest.strategyAddress = strategyAddress;
        harvest.gain = gain;
        harvest.loss = loss;
        harvest.timestamp = timestamp.toI32();
    }
    harvest.save();
}

export const setGVaultStrategy = (
    strategyAddress: Address,
    eventType: string,
    debtPaid: BigDecimal,
    debtAdded: BigDecimal,
    strategyDebt: BigDecimal,
    block: BigInt,
):void => {
    const id = strategyAddress.toHexString();
    log.info('vault strategy: {}',[id])
    let strat = initGVaultStrategy(id);
    
    // TO DO total_assets_strategy 

    if(eventType == "harvest"){
        strat.strategy_debt = strat.strategy_debt.minus(debtPaid).plus(debtAdded);
        strat.block_strategy_reported = block.toI32();
    } else if(eventType == "withdraw"){
        strat.strategy_debt = strategyDebt;
        strat.block_strategy_withdraw = block.toI32();
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
    if(!harvest){
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

// export const setStrategyQueue = (
//     strategyAddress: Address,
//     strategyId: string
// ): void => {
//     let strategyQueue = StrategyQueue.load(strategyId);
//     if(!strategyQueue){
//         strategyQueue = new StrategyQueue(strategyId)
//     }
//     strategyQueue.strategyAddress = strategyAddress;
//     strategyQueue.save();
// }
