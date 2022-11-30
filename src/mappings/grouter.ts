import {
    LogDeposit,
    LogLegacyDeposit,
    LogWithdrawal
} from '../../generated/GRouter/GRouter';
import { parseGRouterDepositEvent } from '../parsers/deposit';
import { parseGRouterWithdrawEvent } from '../parsers/withdrawals';
import { getGroToken } from '../utils/tokens';
import { manageCoreDeposit } from '../managers/deposit';
import { manageCoreWithdrawal } from '../managers/withdrawal';

export function handleLogDeposit(event: LogDeposit): void {
    event.logType
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token
    );
}

export function handleLogLegacyDeposit(event: LogLegacyDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token
    );
}

export function handleLogWithdrawal(event: LogWithdrawal): void {
    const ev = parseGRouterWithdrawEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreWithdrawal(
        ev,
        [],
        token
    );
}


