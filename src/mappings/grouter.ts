import { getGroToken } from '../utils/tokens';
import { setGvtPrice } from '../setters/price';
import { manageCoreDeposit } from '../managers/deposit';
import { parseGRouterDepositEvent } from '../parsers/deposit';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { parseGRouterWithdrawEvent } from '../parsers/withdrawals';
import {
    LogDeposit,
    LogWithdrawal,
    LogLegacyDeposit,
} from '../../generated/GRouter/GRouter';
import {
    setGvtFactor,
    setPwrdFactor
} from '../setters/factors';


const updateFactor = (token: string): void => {
    // Update factor
    if (token === 'pwrd') {
        setPwrdFactor();
    } else if (token === 'gvt') {
        setGvtFactor();
    }
    // Update price
    if (token === 'gvt')
        setGvtPrice();
}

export function handleLogDeposit(event: LogDeposit): void {
    const ev = parseGRouterDepositEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreDeposit(
        ev,
        [],
        token,
    );
    updateFactor(token);
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
    updateFactor(token);
}

export function handleLogWithdrawal(event: LogWithdrawal): void {
    const ev = parseGRouterWithdrawEvent(event);
    const token = getGroToken(event.params.tranche);
    manageCoreWithdrawal(
        ev,
        [],
        token,
    );
    updateFactor(token);
}
