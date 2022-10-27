
import { tokenToDecimal } from '../utils/tokens';
import { Strategy } from '../../generated/schema';
import { Vyper_contract as vaultDAI } from '../../generated/VaultDAI/Vyper_contract';
import { Vyper_contract as vaultUSDC } from '../../generated/VaultUSDC/Vyper_contract';
import { Vyper_contract as vaultUSDT } from '../../generated/VaultUSDT/Vyper_contract';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import { getStrategies } from '../utils/strats';
import {
    log,
    Address,
    BigDecimal,
    BigInt
} from '@graphprotocol/graph-ts';


const noStrategy = (): Strategy => {
    let strat = new Strategy('0x');
    strat.name = 'N/A';
    strat.display_name = 'N/A'
    strat.vault_address = ADDR.ZERO;
    strat.vault_adapter_address = ADDR.ZERO;
    strat.vault_total_assets = NUM.ZERO;
    strat.strategy_debt = NUM.ZERO;
    strat.block = 0;
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
            strat.vault_total_assets = NUM.ZERO;
            strat.strategy_debt = NUM.ZERO;
            strat.block = 0;
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
                strat.vault_total_assets = NUM.ZERO;
                strat.strategy_debt = NUM.ZERO;
                strat.block = 0;
                return strat;
            }
        }
        return noStrategy();
    }
    return strat;
}

//TODO;: merge setStrategyReported functions somehow

export const setStrategyReportedDAI = (
    vaultAddress: Address,
    strategyAddress: Address,
    totalDebt: BigInt,
    block: BigInt,
): void => {
    let strat = initStrategy(strategyAddress.toHexString());
    if (strat.vault_address != ADDR.ZERO) {
        const contract = vaultDAI.bind(vaultAddress);
        const totalAssets = contract.try_totalAssets();
        if (totalAssets.reverted) {
            log.error(`strats.ts->setStrategyReportedDAI: totalAssets reverted`, []);
        } else {
            strat.vault_total_assets = tokenToDecimal(totalAssets.value, 18, DECIMALS);
            strat.strategy_debt = tokenToDecimal(totalDebt, 18, DECIMALS);
            strat.block = block.toI32();
            strat.save();
        }
    } else {
        log.error(`strats.ts->setStrategyReportedDAI: strategy {} not found`,
            [strategyAddress.toHexString()]
        );
    }
}

export const setStrategyReportedUSDC = (
    vaultAddress: Address,
    strategyAddress: Address,
    totalDebt: BigInt,
    block: BigInt,
): void => {
    let strat = initStrategy(strategyAddress.toHexString());
    if (strat.vault_address != ADDR.ZERO) {
        const contract = vaultUSDC.bind(vaultAddress);
        const totalAssets = contract.try_totalAssets();
        if (totalAssets.reverted) {
            log.error(`strats.ts->setStrategyReportedUSDC: totalAssets reverted`, []);
        } else {
            strat.vault_total_assets = tokenToDecimal(totalAssets.value, 6, DECIMALS);
            strat.strategy_debt = tokenToDecimal(totalDebt, 6, DECIMALS);
            strat.block = block.toI32();
            strat.save();
        }
    } else {
        log.error(`strats.ts->setStrategyReportedUSDC: strategy {} not found`,
            [strategyAddress.toHexString()]
        );
    }
}

export const setStrategyReportedUSDT = (
    vaultAddress: Address,
    strategyAddress: Address,
    totalDebt: BigInt,
    block: BigInt,
): void => {
    let strat = initStrategy(strategyAddress.toHexString());
    if (strat.vault_address != ADDR.ZERO) {
        const contract = vaultUSDT.bind(vaultAddress);
        const totalAssets = contract.try_totalAssets();
        if (totalAssets.reverted) {
            log.error(`strats.ts->setStrategyReportedUSDT: totalAssets reverted`, []);
        } else {
            strat.vault_total_assets = tokenToDecimal(totalAssets.value, 6, DECIMALS);
            strat.strategy_debt = tokenToDecimal(totalDebt, 6, DECIMALS);
            strat.block = block.toI32();
            strat.save();
        }
    } else {
        log.error(`strats.ts->setStrategyReportedUSDT: strategy {} not found`,
            [strategyAddress.toHexString()]
        );
    }
}
