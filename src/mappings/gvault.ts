import { setGvtPrice } from '../setters/price';
import { tokenToDecimal } from '../utils/tokens';
import { Address, Bytes } from '@graphprotocol/graph-ts';
import { setUtilizationRatio } from '../setters/gtranche';
import { getStrategyAddressByQueueId } from '../utils/strats';
import { updateFactors } from '../setters/factors';
import {
    NUM,
    ADDR,
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


export function handleStrategyAdded(ev: LogStrategyAdded): void {
    initGVault(ev.address);
}

export function handleLogNewReleaseFactor(ev: LogNewReleaseFactor): void {
    setNewReleaseFactor(
        ev.address,
        ev.params.factor.toI32(),
    );
}

export function handleStrategyHarvestReport(ev: LogStrategyHarvestReport): void {
    // save HarvestReport
    const logIndex = ev.logIndex.toI32();
    const harvest = setGVaultHarvest(
        ev.transaction.hash.concatI32(logIndex),
        ev.params.strategy,
        tokenToDecimal(ev.params.gain, 18, DECIMALS),
        tokenToDecimal(ev.params.loss, 18, DECIMALS),
        tokenToDecimal(ev.params.debtPaid, 18, DECIMALS),
        tokenToDecimal(ev.params.debtAdded, 18, DECIMALS),
        tokenToDecimal(ev.params.lockedProfit, 18, DECIMALS),
        tokenToDecimal(ev.params.lockedProfitBeforeLoss, 18, DECIMALS),
        ev.block.timestamp,
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
        ev.address,
        harvest.locked_profit,
        ev.block.timestamp,
    );

    // update factor
    updateFactors();

    // update gvt price
    setGvtPrice();

    // update Gtoken utilization
    setUtilizationRatio(NUM.ZERO);
}

export function handleWithdrawalFromStrategy(ev: LogWithdrawalFromStrategy): void {
    const strategyAddress = getStrategyAddressByQueueId(ev.params.strategyId.toI32());
    if (strategyAddress != ADDR.ZERO)
        setGVaultDebt(
            strategyAddress,
            'withdrawal',
            tokenToDecimal(ev.params.strategyDebt, 18, DECIMALS),
            ev.block.number,
        );
}

export function handleStrategyTotalChanges(ev: LogStrategyTotalChanges): void {
    // update GVault strategy
    setGVaultDebt(
        ev.params.strategy,
        'total_changes',
        tokenToDecimal(ev.params.totalDebt, 18, DECIMALS),
        ev.block.number,
    );
}
