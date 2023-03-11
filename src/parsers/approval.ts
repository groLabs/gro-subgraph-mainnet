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
///     - Parses approval events from Gro, Gvt & Pwrd contracts
///     - @ts-nocheck is enabled to handle different contract versions with same params

// @ts-nocheck
import { ApprovalEvent } from '../types/approval';


/// @notice Parses <Approval> events from gro, gvt & pwrd contracts
/// @dev ev.params.owner is foreign key to User.id
/// @param ev the approval event
/// @return parsed approval in <ApprovalEvent> class instance
export function parseApprovalEvent<T>(ev: T): ApprovalEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new ApprovalEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number,
        ev.block.timestamp,
        ev.transaction.hash,
        ev.address,
        ev.params.owner,
        ev.params.spender,
        ev.params.value,
    )
    return event;
}
