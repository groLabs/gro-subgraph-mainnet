// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Initialises entity <CoreData>
///     - Updates total supply from entity <CoreData> triggered by a transfer from
///		  any coin (gvt, pwrd, gro or pool-related ones)
/// @dev
///		- There is one single CoreData record with 0x address that gets updated when
///		  the total supply changes

import { tokenToDecimal } from '../utils/tokens';
import { CoreData } from '../../generated/schema';
import { getStoredFactor } from '../setters/factors';
import {
	NUM,
	ADDR,
	DECIMALS,
	TOKEN as Token,
	TX_TYPE as TxType,
} from '../utils/constants';
import {
	BigInt,
	Address,
	BigDecimal,
	log as showLog,
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <CoreData> with default values
/// @param save Stores the entity if true
/// @return CoreData object (there can only be one that gets updated)
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

/// @notice Determines if it's a deposit or withdrawal based on the
///  		from/to params and calls updateTotalSupply()
/// @dev This function is called when there's a Transfer in Balancer,
///	     Uniswap or CurveMeta pools, so depending on the from/to address,
///		 it is considered as a deposit or withdrawal of the pool tokens
/// @param from the <from> address of the transfer
/// @param to the <to> address of the transfer
/// @param amount the amount of the transfer
/// @param coin the coin of the transfer (balancer_gro_weth,
///		   uniswap_gvt_gro, uniswap_gro_usdc or curve_pwrd3crv)
export function setTotalSupply(
	from: Address,
	to: Address,
	amount: BigInt,
	coin: string,
): void {
	const decimals = (coin == Token.UNISWAP_GRO_USDC) ? 12 : DECIMALS;
	if (from == ADDR.ZERO) {
		updateTotalSupply(
			TxType.STAKER_DEPOSIT,
			tokenToDecimal(amount, 18, decimals),
			coin,
		);
	} else if (to == ADDR.ZERO) {
		updateTotalSupply(
			TxType.STAKER_WITHDRAWAL,
			tokenToDecimal(amount, 18, decimals),
			coin,
		);
	}
}

/// @notice Updates the total supply in entity <CoreData>
/// @param side the side of the transfer (deposit or withdrawal)
/// @param amount the amount of the transfer
/// @param coin the coin of the transfer (can be any besides the pool ones)
export const updateTotalSupply = (
	side: string,
	amount: BigDecimal,
	coin: string,
): void => {
	let core = initCoreData(false);
	const basedAmount = (coin === Token.PWRD)
		? amount.times(getStoredFactor(Token.PWRD))
		: NUM.ZERO;
	if (
		side == TxType.CORE_DEPOSIT
		|| side == TxType.STAKER_DEPOSIT
	) {
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
	} else if (
		side == TxType.CORE_WITHDRAWAL
		|| side == TxType.STAKER_WITHDRAWAL
	) {
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
