
import { getGroToken } from '../utils/tokens';
import { setGvtPrice } from '../setters/price';
import { updateGTokenFactor } from '../setters/factors';
import { manageCoreDeposit } from '../managers/deposit';
import { parseGRouterDepositEvent } from '../parsers/deposit';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { parseGRouterWithdrawEvent } from '../parsers/withdrawals';
import {
    LogDeposit,
    LogLegacyDeposit,
    LogWithdrawal
} from '../../generated/GRouter/GRouter';


export function handleLogDeposit(event: LogDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token,
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
        token,
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
        token,
    );
    // update GToken's factor and price
    updateGTokenFactor(event.block.timestamp.toI32());
    setGvtPrice();
}
