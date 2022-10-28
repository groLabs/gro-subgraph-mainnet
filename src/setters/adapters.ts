import { Strategy } from '../../generated/schema';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import { 
    getStrategies,
    getStrategiesByAdapter,
} from '../utils/strats';
import {
    log,
    Address,
    BigDecimal,
    BigInt
} from '@graphprotocol/graph-ts';


export const setSwap = (
    adapterAddress: string,
    fromAddress: string,
    toAddress: string,
    value: BigDecimal,
    block: number,
): void => {

    const strats = getStrategiesByAdapter(adapterAddress);
    for (let i=0; i<strats.length; i++) {
        const strat = Strategy.load(strats[i].id);
        if (strat) {
            strat.adapter_swaps = strat.adapter_swaps.plus(value)
        }
    }




    // let strat = initStrategy(strategyAddress.toHexString());
    // if (strat.vault_address != ADDR.ZERO) {
    //     const contract = vaultDAI.bind(vaultAddress);
    //     const totalAssets = contract.try_totalAssets();
    //     if (totalAssets.reverted) {
    //         log.error(`strats.ts->setStrategyReportedDAI: totalAssets reverted`, []);
    //     } else {
    //         strat.vault_total_assets = tokenToDecimal(totalAssets.value, 18, DECIMALS);
    //         strat.strategy_debt = tokenToDecimal(totalDebt, 18, DECIMALS);
    //         strat.block = block.toI32();
    //         strat.save();
    //     }
    // } else {
    //     log.error(`strats.ts->setStrategyReportedDAI: strategy {} not found`,
    //         [strategyAddress.toHexString()]
    //     );
    // }
}