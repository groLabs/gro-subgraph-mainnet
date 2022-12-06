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
import { updateGTokenFactor } from '../setters/factors';
import { setGvtPrice } from "../setters/price"

export function handleLogDeposit(event: LogDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token
    );

    // update GToken's factor and price
    updateGTokenFactor(event.block.timestamp.toI32());
    setGvtPrice();
}

export function handleLogLegacyDeposit(event: LogLegacyDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token
    );
    // update GToken's factor and price
    updateGTokenFactor(event.block.timestamp.toI32());
    setGvtPrice();
}

export function handleLogWithdrawal(event: LogWithdrawal): void {
    const ev = parseGRouterWithdrawEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreWithdrawal(
        ev,
        [],
        token
    );
    // update GToken's factor and price
    updateGTokenFactor(event.block.timestamp.toI32());
    setGvtPrice();
}


