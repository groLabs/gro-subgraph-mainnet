import { Log } from '../types/log';
import { setGvtPrice } from '../setters/price';
import { parseLogEvent } from '../parsers/log';
import { LogPnLExecution } from '../../generated/PnL/PnL';
import {
	LOG_WITHDRAWAL_SIG_V1,
	LOG_WITHDRAWAL_SIG_V23,
	WITHDRAWAL_HANDLER_ADDRESSES,
} from '../utils/constants';
import {
	setPwrdFactor,
	setGvtFactor
} from '../setters/factors';


// @dev: don't update factor if there is a pwrd withdrawal (the withdrawal will update the factor AFTER the based calc)
export function handlePnLExecution(event: LogPnLExecution): void {
	setGvtPrice();
	setGvtFactor();

	const receipt = event.receipt;
	if (receipt) {
		const logs = parseLogEvent(event.receipt!.logs);
		if (!isWithdrawal(logs))
			setPwrdFactor();
	} else {
		setPwrdFactor();
		// showLog.warning(`No log for tx hash {}`,
		// 	[event.transaction.hash.toHexString()]);
	}

}

// check if the PNL event has a withdrawal event within the same transaction
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
			// showLog.warning(`True for addr {} sig {} tx hash {}`,
			// 	[log.address.toHexString()
			// 		, log.topics[0].toHexString()
			// 		, log.transactionHash.toHexString()
			// 	]);
			return true;
		}
	}
	return false;
}