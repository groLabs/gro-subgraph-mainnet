
import { NUM } from '../utils/constants';
import { CoreData } from '../../generated/schema';
import { getStoredFactor } from '../setters/factors';
import {
	BigDecimal,
	log as showLog,
} from '@graphprotocol/graph-ts';


export const initCoreData = (save: boolean): CoreData => {
	let core = CoreData.load('0x');
	if (!core) {
		core = new CoreData('0x');
		core.total_supply_gvt = NUM.ZERO;
		core.total_supply_pwrd_based = NUM.ZERO;
		core.total_supply_gro = NUM.ZERO;
		if (save)
			core.save();
	}
	return core;
}

export const updateTotalSupply = (
	side: string,
	amount: BigDecimal,
	coin: string,
): void => {
	let core = initCoreData(false);
	const basedAmount = (coin === 'pwrd')
		? amount.times(getStoredFactor('pwrd'))
		: NUM.ZERO;

	if (side === 'deposit') {
		if (coin === 'gvt') {
			core.total_supply_gvt = core.total_supply_gvt.plus(amount);
		} else if (coin === 'pwrd') {
			core.total_supply_pwrd_based = core.total_supply_pwrd_based.plus(basedAmount);
		} else if (coin === 'gro') {
			core.total_supply_gro = core.total_supply_gro.plus(amount);
		} else {
			showLog.error(`coreData.ts->updateTotalSupply(): can't update for {} {}`, [coin, side]);
		}
	} else if (side === 'withdrawal') {
		if (coin === 'gvt') {
			core.total_supply_gvt = core.total_supply_gvt.minus(amount);
		} else if (coin === 'pwrd') {
			core.total_supply_pwrd_based = core.total_supply_pwrd_based.minus(basedAmount);
		} else if (coin === 'gro') {
			core.total_supply_gro = core.total_supply_gro.minus(amount);
		} else {
			showLog.error(`coreData.ts->updateTotalSupply(): can't update for {} {}`, [coin, side]);
		}
	} else {
		showLog.error(`coreData.ts->updateTotalSupply(): can't update for {}`, [side]);
	}
	core.save();
}
