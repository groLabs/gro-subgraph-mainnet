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
///     - Handles <LogNewWithdrawal> events from WithdrawHandler v1,v2 & v3 contracts
///     - WithdrawHandlers are replaced by GRouter, though they are still used
///       in this subgraph to have the complete User's transactions history  
/// @dev
///     - WithdrawHandler v1: 0xd89512bdf570476310de854ef69d715e0e85b09f
///     - WithdrawHandler v2: 0x59b6b763509198d07cf8f13a2dc6f2df98cb0a1d
///     - WithdrawHandler v3: 0x641befa4db601578a64f0fc1f4e89e9869268fe7

import { getGroToken } from '../utils/tokens';
import { parseLogEvent } from '../parsers/log';
import { manageCoreWithdrawal } from '../managers/withdrawal';
import { parseCoreWithdrawalEvent } from '../parsers/withdrawals';
import { LogNewWithdrawal as LogNewWithdrawalV1 } from '../../generated/WithdrawHandlerV1/WithdrawHandler';
import { LogNewWithdrawal as LogNewWithdrawalV2 } from '../../generated/WithdrawHandlerV2/WithdrawHandler';
import { LogNewWithdrawal as LogNewWithdrawalV3 } from '../../generated/WithdrawHandlerV3/WithdrawHandler';


/// @notice Handles <LogNewWithdrawal> events from WithdrawHandler V1 contract
/// @param event the withdrawal event
export function handleWithdrawalV1(event: LogNewWithdrawalV1): void {
    // Parses the withdrawal into class <DepoWithdrawEvent>
    const ev = parseCoreWithdrawalEvent(event);

    // Parses the withdrawal transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.pwrd);

    // Manages the withdrawal
    manageCoreWithdrawal(
        ev,
        logs,
        token
    );
}

/// @notice Handles <LogNewWithdrawal> events from WithdrawHandler V2 contract
/// @param event the withdrawal event
export function handleWithdrawalV2(event: LogNewWithdrawalV2): void {
    // Parses the withdrawal into class <DepoWithdrawEvent>
    const ev = parseCoreWithdrawalEvent(event);

    // Parses the withdrawal transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.pwrd);

    // Manages the withdrawal
    manageCoreWithdrawal(
        ev,
        logs,
        token
    );
}

/// @notice Handles <LogNewWithdrawal> events from WithdrawHandler V3 contract
/// @param event the withdrawal event
export function handleWithdrawalV3(event: LogNewWithdrawalV3): void {
    // Parses the withdrawal into class <DepoWithdrawEvent>
    const ev = parseCoreWithdrawalEvent(event);

    // Parses the withdrawal transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.pwrd);

    // Manages the withdrawal
    manageCoreWithdrawal(
        ev,
        logs,
        token
    );
}
