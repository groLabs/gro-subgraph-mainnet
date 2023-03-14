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
///     - Handles <LogDeposit>, <LogLegacyDeposit> & <LogWithdrawal> events from 
///       GRouter contract
/// @dev
///     - GRouter: 0xd4139e090e43ff77172d9dd8ba449d2a9683790d

import { getGroToken } from '../utils/tokens';
import { setGvtPrice } from '../setters/price';
import { updateFactor } from '../setters/factors';
import { TOKEN as Token} from '../utils/constants';
import { manageCoreDeposit } from '../managers/deposit';
import { parseGRouterDepositEvent } from '../parsers/deposit';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { parseGRouterWithdrawEvent } from '../parsers/withdrawals';
import {
    LogDeposit,
    LogWithdrawal,
    LogLegacyDeposit,
} from '../../generated/GRouter/GRouter';



/// @notice Updates the factor/price
/// @param token the token for which the factor/price needs to be updated
const updateFactors = (token: string): void => {
    if (token === Token.PWRD) {
        updateFactor(Token.PWRD);
    } else if (token === Token.GVT) {
        updateFactor(Token.GVT);
        setGvtPrice();
    } 
}

/// @notice Handles <LogDeposit> events from GRouter contract
/// @param event the deposit event
export function handleLogDeposit(event: LogDeposit): void {
    // Parses the deposit into class <DepoWithdrawEvent>
    const ev = parseGRouterDepositEvent(event);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.tranche);

    // Manages the deposit
    manageCoreDeposit(
        ev,
        [],
        token,
    );

    // Updates the factor/price
    updateFactors(token);
}

/// @notice Handles <LogLegacyDeposit> events from GRouter contract
/// @param event the legacy deposit event
/// @dev: Currently disabled. To be used for potential integrations with Gro Protocol
export function handleLogLegacyDeposit(event: LogLegacyDeposit): void {
    // Parses the deposit into class <DepoWithdrawEvent>
    const ev = parseGRouterDepositEvent(event);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.tranche);

    // Manages the deposit
    manageCoreDeposit(
        ev,
        [],
        token,
    );

    // Updates the factor/price
    updateFactors(token);
}

/// @notice Handles <LogWithdrawal> events from GRouter contract
/// @param event the withdrawal event
export function handleLogWithdrawal(event: LogWithdrawal): void {
    // Parses the deposit into class <DepoWithdrawEvent>
    const ev = parseGRouterWithdrawEvent(event);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.tranche);

    // Manages the withdrawal
    manageCoreWithdrawal(
        ev,
        [],
        token,
    );

    // Updates the factor/price
    updateFactors(token);
}
