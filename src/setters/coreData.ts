import { Address, BigInt } from '@graphprotocol/graph-ts';
import { CoreData } from '../../generated/schema';
import {
	getFactor,
	tokenToDecimal,
} from '../utils/tokens';
import {
	NUM,
	ADDR,
	DECIMALS,
} from '../utils/constants';


export const initCoreData = (): CoreData => {
	let core = CoreData.load('0x');
	if (!core) {
		core = new CoreData('0x');
		core.total_supply_gvt = NUM.ZERO;
		core.total_supply_pwrd = NUM.ZERO;
		core.total_supply_pwrd_based = NUM.ZERO;
		core.save();
	}
	return core;
}

export const updateTotalSupply = (
	from: Address,
	_amount: BigInt,
	coin: string,
): void => {
	let core = initCoreData();

	const side = (from == ADDR.ZERO) ? 'in' : 'out';
	const amount = tokenToDecimal(_amount, 18, DECIMALS);
	const basedAmount = (coin === 'pwrd')
		? amount.times(getFactor('pwrd'))
		: NUM.ZERO;

	if (side === 'in') {
		if (coin === 'gvt') {
			core.total_supply_gvt = core.total_supply_gvt.plus(amount);
		} else if (coin === 'pwrd') {
			core.total_supply_pwrd = core.total_supply_pwrd.plus(amount);
			core.total_supply_pwrd_based = core.total_supply_pwrd_based
				.plus(basedAmount).truncate(DECIMALS);
		} else {
			// show error
		}
	} else if (side === 'out') {
		if (coin === 'gvt') {
			core.total_supply_gvt = core.total_supply_gvt.minus(amount);
		} else if (coin === 'pwrd') {
			core.total_supply_pwrd = core.total_supply_pwrd.minus(amount);
			core.total_supply_pwrd_based = core.total_supply_pwrd_based
				.minus(basedAmount).truncate(DECIMALS);;
		} else {
			// show error
		}
	} else {
		// show error
	}
	core.save();
}
