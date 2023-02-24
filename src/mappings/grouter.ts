import { getGroToken } from '../utils/tokens';
import { setGvtPrice } from '../setters/price';
import { updateFactors } from '../setters/factors';
import { manageCoreDeposit } from '../managers/deposit';
import { parseGRouterDepositEvent } from '../parsers/deposit';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { parseGRouterWithdrawEvent } from '../parsers/withdrawals';
import {
    LogDeposit,
    LogWithdrawal,
    LogLegacyDeposit,
} from '../../generated/GRouter/GRouter';


export function handleLogDeposit(event: LogDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token,
    );
    updateFactors();
    setGvtPrice();
}

// @dev: Currently disabled. To be used for potential integrations with Gro Protocol
export function handleLogLegacyDeposit(event: LogLegacyDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token,
    );
    updateFactors();
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
    updateFactors();
    setGvtPrice();
}
