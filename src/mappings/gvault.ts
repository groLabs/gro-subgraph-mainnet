import {
 LogStrategyHarvestReport
} from '../../generated/GVault/GVault';
import {
	updateGTokenFactor as updateFactor
} from '../setters/factors';

export function handleStrategyHarvestReport(event: LogStrategyHarvestReport): void {
    updateFactor(event.block.timestamp.toI32())
  }