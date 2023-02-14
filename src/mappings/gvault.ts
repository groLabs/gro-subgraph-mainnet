import { setGvtPrice } from '../setters/price';
import { tokenToDecimal } from '../utils/tokens';
import { setNewReleaseFactor } from '../setters/gvault';
import { setUtilizationRatio } from '../setters/gtranche';
import { getStrategyAddressByQueueId } from '../utils/strats';
import { updateFactors } from '../setters/factors';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    // Deposit,
    // Withdraw,
    LogNewReleaseFactor,
    LogStrategyHarvestReport,
    LogWithdrawalFromStrategy,
} from '../../generated/GVault/GVault';
import {
    setGVaultDebt,
    setGVaultHarvest,
    // updateAllGVaultDebts,
} from '../setters/stratsGVault';


export function handleLogNewReleaseFactor(event: LogNewReleaseFactor): void {
    setNewReleaseFactor(event.params.factor.toI32());
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
        tokenToDecimal(event.params.excessLoss, 18, DECIMALS),
        event.block.timestamp,
    );

    // calc lockedProfit
    // @dev: if loss > lockedProfitBeforeLoss, then lockedProfit = loss - lockedProfitBeforeLoss
    //       this is to handle negative profit from the last harvest
    let lockedProfit = NUM.ZERO;
    if (harvest.loss.gt(harvest.excessLoss)) {
        lockedProfit = harvest.excessLoss.minus(harvest.loss)
    } else {
        lockedProfit = harvest.lockedProfit;
    }

    // update GVault strategy
    setGVaultDebt(
        event.params.strategy,
        'harvest',
        harvest.debtPaid,
        harvest.debtAdded,
        NUM.ZERO,
        lockedProfit,
        event.block.number,
    )

    // update factor
    updateFactors();

    // update gvt price
    setGvtPrice();

    // update Gtoken utilization
    setUtilizationRatio(NUM.ZERO);
}

// export function handleDeposit(event: Deposit): void {
//     updateAllGVaultDebts();
// }

// export function handleWithdraw(event: Withdraw): void {
//     updateAllGVaultDebts();
// }

export function handleWithdrawalFromStrategy(event: LogWithdrawalFromStrategy): void {
    // TODO: confirm strategyId
    const strategyAddress = getStrategyAddressByQueueId(event.params.strategyId.toI32());
    setGVaultDebt(
        strategyAddress,
        'withdrawal',
        NUM.ZERO,
        NUM.ZERO,
        tokenToDecimal(event.params.strategyDebt, 18, DECIMALS),
        NUM.ZERO,
        event.block.number,
    );
}
