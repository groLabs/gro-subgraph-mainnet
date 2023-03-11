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
///     - Handles <LogNewDeposit> events from DepositHandler v1, v2 & v3 contracts
///     - DepositHandlers are replaced by GRouter, though they are still used
///       in this subgraph to have the complete User's transactions history  
/// @dev
///     - DepositHandler v1: 0x79b14d909381d79b655c0700d0fdc2c7054635b9
///     - DepositHandler v2: 0x9da6ad743f4f2a247a56350703a4b501c7f2c224
///     - DepositHandler v3: 0xb7207ea9446dca1dec1c1fc93c6fcdf8b4a44f40

import { getGroToken } from '../utils/tokens';
import { parseLogEvent } from '../parsers/log';
import { manageCoreDeposit } from '../managers/deposit';
import { parseCoreDepositEvent } from '../parsers/deposit';
import { LogNewDeposit as LogNewDepositV1 } from '../../generated/DepositHandlerV1/DepositHandler';
import { LogNewDeposit as LogNewDepositV2 } from '../../generated/DepositHandlerV2/DepositHandler';
import { LogNewDeposit as LogNewDepositV3 } from '../../generated/DepositHandlerV3/DepositHandler';


// @dev: totalSupply can't be deduced from deposits only, as there are other transactions that
//       mint GVT that are not triggered by deposits (aka. harvests)
//       e.g.: 0x2f38030991c7e657afe3f69fad665474a234886c560e04bf488ebed1fa846363

/// @notice Handles <LogNewDeposit> from DepositHandler V1 contract
/// @param event the deposit event
export function handleDepositV1(event: LogNewDepositV1): void {
    // Parses the deposit into class <DepoWithdrawEvent>
    const ev = parseCoreDepositEvent(event);

    // Parses the deposit transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Determines whether token is gvt or pwrd 
    const token = getGroToken(event.params.pwrd);

    // Manages the deposit
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

/// @notice Handles <LogNewDeposit> events from DepositHandler V2 contract
/// @param event the deposit event
export function handleDepositV2(event: LogNewDepositV2): void {
    // Parses the deposit into class <DepoWithdrawEvent>
    const ev = parseCoreDepositEvent(event);

    // Parses the deposit transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Determines whether token is gvt or pwrd
    const token = getGroToken(event.params.pwrd);

    // Manages the deposit
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

/// @notice Handles <LogNewDeposit> events from DepositHandler V3 contract
/// @param event the deposit event
export function handleDepositV3(event: LogNewDepositV3): void {
    // Parses the deposit into class <DepoWithdrawEvent>
    const ev = parseCoreDepositEvent(event);

    // Parses the deposit transaction logs into class <Log>
    const logs = parseLogEvent(event.receipt!.logs);

    // Determines whether token is gvt or pwrd
    const token = getGroToken(event.params.pwrd);

    // Manages the deposit
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

