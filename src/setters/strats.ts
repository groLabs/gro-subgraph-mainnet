
import { tokenToDecimal } from '../utils/tokens';
import { Strategy } from '../../generated/schema';
import { Vyper_contract as vaultAdapter } from '../../generated/VaultAdapter/Vyper_contract';
import { StableConvexXPool as convexStrategy } from '../../generated/ConvexStrategy/StableConvexXPool';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import {
    getStrategies,
    getAdapterAddressByStrategy,
} from '../utils/strats';
import {
    log,
    Address,
    BigInt
} from '@graphprotocol/graph-ts';


const noStrategy = (): Strategy => {
    let strat = new Strategy('0x');
    strat.name = 'N/A';
    strat.display_name = 'N/A'
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
            strat.name = str.name;
            strat.display_name = str.displayName
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
                strat.name = str.name;
                strat.display_name = str.displayName
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
export const setStrategyReported = (
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
        const contractAdapter = vaultAdapter.bind(adapterAddress);
        const totalAssets = contractAdapter.try_totalAssets();
        const contractStrategy = convexStrategy.bind(strategyAddress);
        const totalEstimatedAssets = contractStrategy.try_estimatedTotalAssets();
        if (totalAssets.reverted) {
            log.error(
                `strats.ts->setStrategyReported: totalAssets reverted for adapter {}`,
                [adapterAddress.toHexString()]
            );
        } else if (totalEstimatedAssets.reverted) {
            log.error(
                `strats.ts->setStrategyReported: totalEstimatedAssets reverted for strategy {}`,
                [id]
            );
        } else {
            strat.total_assets_adapter = tokenToDecimal(totalAssets.value, base, DECIMALS);
            strat.total_assets_strategy = tokenToDecimal(totalEstimatedAssets.value, base, DECIMALS);
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
            Address.fromString(strats[i].id),
            BigInt.fromString('0'),
            block,
            strats[i].coin,
            false,
        );
    }
}
