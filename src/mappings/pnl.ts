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
///     - Handles <LogPnLExecution> events from PnL contract
///     - PnL is replaced by G2 contracts, though it is still used in this
///       subgraph to have the correct factor & price during gvt & pwrd transactions  
/// @dev
///     - PnL: 0xf67a426e110c74c566174a37c9269780fb48096d

import { Log } from '../types/log';
import { setGvtPrice } from '../setters/price';
import { parseLogEvent } from '../parsers/log';
import { updateFactor } from '../setters/factors';
import { LogPnLExecution } from '../../generated/PnL/PnL';
import {
	TOKEN as Token,
	LOG_WITHDRAWAL_SIG_V1,
	LOG_WITHDRAWAL_SIG_V23,
	WITHDRAWAL_HANDLER_ADDRESSES,
} from '../utils/constants';


/// @notice Handles <LogPnLExecution> events from PnL contract
/// @param event the pnl execution event
/// @dev don't update factor if there is a pwrd withdrawal, since the withdrawal
///      will update the factor AFTER the based calc
export function handlePnLExecution(event: LogPnLExecution): void {
	setGvtPrice();
	updateFactor(Token.GVT);
	const receipt = event.receipt;
	if (receipt) {
		const logs = parseLogEvent(event.receipt!.logs);
		if (!isWithdrawal(logs))
			updateFactor(Token.PWRD);
	} else {
		updateFactor(Token.PWRD);
	}
}

/// @return True if the PNL event has a withdrawal event within the same transaction
///			False otherwise
export function isWithdrawal(
	logs: Log[],
): boolean {
	for (let i = 0; i < logs.length; i++) {
		const log = logs[i];
		if (
			WITHDRAWAL_HANDLER_ADDRESSES.includes(log.address)
			&& (log.topics[0].toHexString() == LOG_WITHDRAWAL_SIG_V1
				|| log.topics[0].toHexString() == LOG_WITHDRAWAL_SIG_V23)
		) {
			return true;
		}
	}
	return false;
}
