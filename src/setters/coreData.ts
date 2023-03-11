import { tokenToDecimal } from '../utils/tokens';
import { CoreData } from '../../generated/schema';
import { getStoredFactor } from '../setters/factors';
import {
	NUM,
	ADDR,
	DECIMALS,
	TOKEN as Token,
} from '../utils/constants';
import {
	Address,
	BigDecimal,
	BigInt,
	log as showLog,
} from '@graphprotocol/graph-ts';


export const initCoreData = (save: boolean): CoreData => {
	let core = CoreData.load(ADDR.ZERO);
	if (!core) {
		core = new CoreData(ADDR.ZERO);
		core.total_supply_gvt = NUM.ZERO;
		core.total_supply_pwrd_based = NUM.ZERO;
		core.total_supply_gro = NUM.ZERO;
		core.total_supply_uniswap_gvt_gro = NUM.ZERO;
		core.total_supply_uniswap_gro_usdc = NUM.ZERO;
		core.total_supply_curve_pwrd3crv = NUM.ZERO;
		core.total_supply_balancer_gro_weth = NUM.ZERO;
		if (save)
			core.save();
	}
	return core;
}

export function setTotalSupply (
	from: Address,
	to: Address,
	amount: BigInt,
	coin: string,
): void {
	const decimals = (coin == Token.UNISWAP_GRO_USDC) ? 12 : DECIMALS;
	if (from == ADDR.ZERO) {
		updateTotalSupply(
			'deposit',
			tokenToDecimal(amount, 18, decimals),
			coin,
		);
	} else if (to == ADDR.ZERO) {
		updateTotalSupply(
			'withdrawal',
			tokenToDecimal(amount, 18, decimals),
			coin,
		);
	}
}

export const updateTotalSupply = (
	side: string,
	amount: BigDecimal,
	coin: string,
): void => {
	let core = initCoreData(false);
	const basedAmount = (coin === Token.PWRD)
		? amount.times(getStoredFactor(Token.PWRD))
		: NUM.ZERO;

	if (side === 'deposit') {
		if (coin === Token.GVT) {
			core.total_supply_gvt = core.total_supply_gvt.plus(amount);
		} else if (coin === Token.PWRD) {
			core.total_supply_pwrd_based = core.total_supply_pwrd_based.plus(basedAmount);
		} else if (coin === Token.GRO) {
			core.total_supply_gro = core.total_supply_gro.plus(amount);
		} else if (coin === Token.UNISWAP_GVT_GRO) {
			core.total_supply_uniswap_gvt_gro = core.total_supply_uniswap_gvt_gro.plus(amount);
		} else if (coin === Token.UNISWAP_GRO_USDC) {
			core.total_supply_uniswap_gro_usdc = core.total_supply_uniswap_gro_usdc.plus(amount);
		} else if (coin === Token.CURVE_PWRD3CRV) {
			core.total_supply_curve_pwrd3crv = core.total_supply_curve_pwrd3crv.plus(amount);
		} else if (coin === Token.BALANCER_GRO_WETH) {
			core.total_supply_balancer_gro_weth = core.total_supply_balancer_gro_weth.plus(amount);
		} else {
			showLog.error(`coreData.ts->updateTotalSupply(): can't update for coin {} side {}`, [coin, side]);
		}
	} else if (side === 'withdrawal') {
		if (coin === Token.GVT) {
			core.total_supply_gvt = core.total_supply_gvt.minus(amount);
		} else if (coin === Token.PWRD) {
			core.total_supply_pwrd_based = core.total_supply_pwrd_based.minus(basedAmount);
		} else if (coin === Token.GRO) {
			core.total_supply_gro = core.total_supply_gro.minus(amount);
		} else if (coin === Token.UNISWAP_GVT_GRO) {
			core.total_supply_uniswap_gvt_gro = core.total_supply_uniswap_gvt_gro.minus(amount);
		} else if (coin === Token.UNISWAP_GRO_USDC) {
			core.total_supply_uniswap_gro_usdc = core.total_supply_uniswap_gro_usdc.minus(amount);
		} else if (coin === Token.CURVE_PWRD3CRV) {
			core.total_supply_curve_pwrd3crv = core.total_supply_curve_pwrd3crv.minus(amount);
		} else if (coin === Token.BALANCER_GRO_WETH) {
			core.total_supply_balancer_gro_weth = core.total_supply_balancer_gro_weth.minus(amount);
		} else {
			showLog.error(`coreData.ts->updateTotalSupply(): can't update for coin {} side {}`, [coin, side]);
		}
	} else {
		showLog.error(`coreData.ts->updateTotalSupply(): can't update for side {}`, [side]);
	}
	core.save();
}
