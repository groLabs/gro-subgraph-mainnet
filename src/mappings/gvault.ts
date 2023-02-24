import { setGvtPrice } from '../setters/price';
import { tokenToDecimal } from '../utils/tokens';
import { Address } from '@graphprotocol/graph-ts';
import { setUtilizationRatio } from '../setters/gtranche';
import { getStrategyAddressByQueueId } from '../utils/strats';
import { updateFactors } from '../setters/factors';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    initGVault,
    setNewReleaseFactor,
} from '../setters/gvault';
import {
    setGVaultDebt,
    setGVaultHarvest,
    setGVaultLockedProfit,
} from '../setters/stratsGVault';
import {
    LogStrategyAdded,
    LogNewReleaseFactor,
    LogStrategyTotalChanges,
    LogStrategyHarvestReport,
    LogWithdrawalFromStrategy,
} from '../../generated/GVault/GVault';


export function handleStrategyAdded(event: LogStrategyAdded): void {
    initGVault(event.address);
}

export function handleLogNewReleaseFactor(event: LogNewReleaseFactor): void {
    setNewReleaseFactor(
        event.address,
        event.params.factor.toI32(),
    );
}

export function handleStrategyHarvestReport(event: LogStrategyHarvestReport): void {
    // save HarvestReport
    const harvest = setGVaultHarvest(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
        event.params.strategy.toHexString(),
        tokenToDecimal(event.params.gain, 18, DECIMALS),
        tokenToDecimal(event.params.loss, 18, DECIMALS),
        tokenToDecimal(event.params.debtPaid, 18, DECIMALS),
        tokenToDecimal(event.params.debtAdded, 18, DECIMALS),
        tokenToDecimal(event.params.lockedProfit, 18, DECIMALS),
        tokenToDecimal(event.params.lockedProfitBeforeLoss, 18, DECIMALS),
        event.block.timestamp,
    );

    // calc lockedProfit
    // @dev: if loss > lockedProfitBeforeLoss, then lockedProfit = loss - lockedProfitBeforeLoss
    //       this is to handle negative profit from the last harvest
    // TODO: REVIEW
    // let lockedProfit = NUM.ZERO;
    // if (harvest.loss.gt(harvest.excessLoss)) {
    //     lockedProfit = harvest.excessLoss.minus(harvest.loss)
    // } else {
    //     lockedProfit = harvest.lockedProfit;
    // }
    //lockedProfit = harvest.locked_profit;

    // update GVault lockedProfit
    setGVaultLockedProfit(
        event.address,
        harvest.locked_profit,
        event.block.timestamp,
    );

    // update factor
    updateFactors();

    // update gvt price
    setGvtPrice();

    // update Gtoken utilization
    setUtilizationRatio(NUM.ZERO);
}

export function handleWithdrawalFromStrategy(event: LogWithdrawalFromStrategy): void {
    const strategyAddress = getStrategyAddressByQueueId(event.params.strategyId.toI32());
    if (strategyAddress != Address.zero())
        setGVaultDebt(
            strategyAddress,
            'withdrawal',
            tokenToDecimal(event.params.strategyDebt, 18, DECIMALS),
            event.block.number,
        );
}

export function handleStrategyTotalChanges(event: LogStrategyTotalChanges): void {
    // update GVault strategy
    setGVaultDebt(
        event.params.strategy,
        'total_changes',
        tokenToDecimal(event.params.totalDebt, 18, DECIMALS),
        event.block.number,
    );
}
