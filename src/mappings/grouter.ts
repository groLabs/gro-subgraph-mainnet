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
import {
	updateGTokenFactor
} from '../setters/factors';

export function handleLogDeposit(event: LogDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token
    );
    updateGTokenFactor(event.block.timestamp.toI32())
}

export function handleLogLegacyDeposit(event: LogLegacyDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token
    );
    updateGTokenFactor(event.block.timestamp.toI32())
}

export function handleLogWithdrawal(event: LogWithdrawal): void {
    const ev = parseGRouterWithdrawEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreWithdrawal(
        ev,
        [],
        token
    );
    updateGTokenFactor(event.block.timestamp.toI32())
}


