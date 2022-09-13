import { LogNewWithdrawal as newWithdrawalV1Event } from '../../generated/WithdrawHandlerV1/WithdrawHandler';
import { LogNewWithdrawal as newWithdrawalV2Event } from '../../generated/WithdrawHandlerV2/WithdrawHandler';
import { LogNewWithdrawal as newWithdrawalV3Event } from '../../generated/WithdrawHandlerV3/WithdrawHandler';
import { parseCoreWithdrawalEvent } from '../parsers/withdrawals';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { getGroToken } from '../utils/tokens';
import { parseLogEvent } from '../parsers/log';


export function handleWithdrawalV1(event: newWithdrawalV1Event): void {
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

export function handleWithdrawalV2(event: newWithdrawalV2Event): void {
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

export function handleWithdrawalV3(event: newWithdrawalV3Event): void {
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

