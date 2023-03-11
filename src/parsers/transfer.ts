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
///     - Parses transfer events from Gro, Gvt & Pwrd contracts
///     - @ts-nocheck is enabled to handle different contract versions with same params

// @ts-nocheck
import { TransferEvent } from '../types/transfer';


/// @notice Parses <Transfer> events from gro, gvt & pwrd contracts
/// @param ev the transfer event
/// @return parsed transfer in <TransferEvent> class instance
export function parseTransferEvent<T>(ev: T): TransferEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new TransferEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number,
        ev.block.timestamp,
        ev.transaction.hash,
        ev.address,
        ev.params.from,
        ev.params.to,
        ev.params.value,
    )
    return event;
}
