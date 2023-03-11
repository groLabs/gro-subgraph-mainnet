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
///     - Handles <LogEmergencyWithdrawal> events from EmergencyHandler contract
///     - The log does not emit data, so the amount is retrieved through the logs
///       within the emergency withdrawal transaction
/// @dev
///     - EmergencyHandler: 0xc535cfe245d8f969e647b3dd8be1255ec076ee76

import { parseLogEvent } from '../parsers/log';
import { parseCoreEmergencyWithdrawalEvent } from '../parsers/withdrawals';
import { manageEmergencyCoreWithdrawal } from '../managers/emergencyWithdrawal';
import { LogEmergencyWithdrawal } from '../../generated/EmergencyHandlerV3/EmergencyHandler';


/// @notice Handles <LogEmergencyWithdrawal> events from EmergencyHandler contract
/// @param event the emergency withdrawal event
export function handleEmergencyWithdrawalV3(event: LogEmergencyWithdrawal): void {
    // Parses the withdrawal into class <DepoWithdrawEvent>
    const ev = parseCoreEmergencyWithdrawalEvent(event);

    // Parses the withdrawal transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Manages withdrawal
    manageEmergencyCoreWithdrawal(
        ev,
        logs,
    );
}
