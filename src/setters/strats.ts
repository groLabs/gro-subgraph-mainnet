import {
    amountToUsd,
    tokenToDecimal
} from '../utils/tokens';
import {
    Harvest,
    Strategy,
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
