import {
 LogStrategyHarvestReport,
 LogWithdrawalFromStrategy,
 LogStrategyAdded
} from '../../generated/GVault/GVault';
import {
	updateGTokenFactor as updateFactor
} from '../setters/factors';
import { setGvtPrice } from '../setters/price';
import { updateGTokenUtilization } from '../setters/masterdata'
import { 
  setGVaultHarvest,
  setStrategyQueue,
  setGVaultStrategy,
  setStrategyWithdraw
} from '../setters/strats';
import { tokenToDecimal } from '../utils/tokens';
import { DECIMALS, NUM } from '../utils/constants';
import { Address } from '@graphprotocol/graph-ts';

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
      event.block.number
    )

    // update factor
    updateFactor(event.block.timestamp.toI32());

    // update gvt price
    setGvtPrice();

    // update GToken utilization
    updateGTokenUtilization();
}

export function handleWithdrawalFromStrategy(event: LogWithdrawalFromStrategy): void {
    const withdraw = setStrategyWithdraw(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
      event.params.strategyId,
      tokenToDecimal(event.params.strategyDebt, 18, DECIMALS),
      tokenToDecimal(event.params.totalVaultDebt, 18, DECIMALS),
      tokenToDecimal(event.params.lossFromStrategyWithdrawal, 18, DECIMALS),
      event.block.timestamp
    )

    // update GVault strategy
    setGVaultStrategy(
      Address.fromString(withdraw.strategyAddress),
      'withdraw',
      NUM.ZERO,
      NUM.ZERO,
      withdraw.strategyDebt,
      event.block.number
    )
}

export function handleStrategyAdded(event: LogStrategyAdded): void {
  setStrategyQueue(event.params.strategy, event.params.id.toI32().toString())
}