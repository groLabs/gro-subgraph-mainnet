import {
 LogStrategyHarvestReport
} from '../../generated/GVault/GVault';
import {
	updateGTokenFactor as updateFactor
} from '../setters/factors';
import { setGvtPrice } from '../setters/price';

export function handleStrategyHarvestReport(event: LogStrategyHarvestReport): void {
    // update factor
    updateFactor(event.block.timestamp.toI32());

    // update gvt price
    setGvtPrice();
  }