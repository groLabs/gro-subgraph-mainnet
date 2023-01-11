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
  LogNewReleaseFactor,
  LogStrategyHarvestReport,
  LogWithdrawalFromStrategy,
} from '../../generated/GVault/GVault';
import {
  setGVaultHarvest,
  setGVaultStrategy,
} from '../setters/stratsGVault';


export function handleLogNewReleaseFactor(event: LogNewReleaseFactor): void {
  setNewReleaseFactor(event.params.factor.toI32());
}

export function handleStrategyHarvestReport(event: LogStrategyHarvestReport): void {
  //Save HarvestReport
  const harvest = setGVaultHarvest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
    event.params.strategy.toHexString(),
    tokenToDecimal(event.params.gain, 18, DECIMALS),
    tokenToDecimal(event.params.loss, 18, DECIMALS),
    tokenToDecimal(event.params.debtPaid, 18, DECIMALS),
    tokenToDecimal(event.params.debtAdded, 18, DECIMALS),
    tokenToDecimal(event.params.lockedProfit, 18, DECIMALS),
    event.block.timestamp,
  );

  // update GVault strategy
  setGVaultStrategy(
    event.params.strategy,
    'harvest',
    harvest.debtPaid,
    harvest.debtAdded,
    NUM.ZERO,
    event.block.number,
  )

  // update factor
  updateFactors();

  // update gvt price
  setGvtPrice();

  // update Gtoken utilization
  setUtilizationRatio(NUM.ZERO);
}

export function handleWithdrawalFromStrategy(event: LogWithdrawalFromStrategy): void {
  // const withdraw = setStrategyWithdraw(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
  //   event.params.strategyId,
  //   tokenToDecimal(event.params.strategyDebt, 18, DECIMALS),
  //   tokenToDecimal(event.params.totalVaultDebt, 18, DECIMALS),
  //   tokenToDecimal(event.params.lossFromStrategyWithdrawal, 18, DECIMALS),
  //   event.block.timestamp
  // )

  // update GVault strategy
  const strategyAddress = getStrategyAddressByQueueId(event.params.strategyId.toI32());
  setGVaultStrategy(
    strategyAddress,
    'withdraw',
    NUM.ZERO,
    NUM.ZERO,
    tokenToDecimal(event.params.strategyDebt, 18, DECIMALS),
    event.block.number,
  );
}

// export function handleStrategyAdded(event: LogStrategyAdded): void {
//   setStrategyQueue(event.params.strategy, event.params.id.toI32().toString());
// }

