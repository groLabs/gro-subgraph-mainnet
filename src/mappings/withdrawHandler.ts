import { LogNewWithdrawal as LogNewWithdrawalV1 } from '../../generated/WithdrawHandlerV1/WithdrawHandler';
import { LogNewWithdrawal as LogNewWithdrawalV2 } from '../../generated/WithdrawHandlerV2/WithdrawHandler';
import { LogNewWithdrawal as LogNewWithdrawalV3 } from '../../generated/WithdrawHandlerV3/WithdrawHandler';
import { parseCoreWithdrawalEvent } from '../parsers/withdrawals';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { getGroToken } from '../utils/tokens';
import { parseLogEvent } from '../parsers/log';


export function handleWithdrawalV1(event: LogNewWithdrawalV1): void {
    //setLatestPrice('groDAI_e_vault_v1_0');
    const ev = parseCoreWithdrawalEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreWithdrawal(
        ev,
        logs,
        token
    );
}

export function handleWithdrawalV2(event: LogNewWithdrawalV2): void {
    //setLatestPrice('groUSDC_e_vault_v1_0');
    const ev = parseCoreWithdrawalEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreWithdrawal(
        ev,
        logs,
        token
    );
}

export function handleWithdrawalV3(event: LogNewWithdrawalV3): void {
    //setLatestPrice('groUSDT_e_vault_v1_0');
    const ev = parseCoreWithdrawalEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreWithdrawal(
        ev,
        logs,
        token
    );
}
