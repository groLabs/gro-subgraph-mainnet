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
///     - Parses new drop events from Airdrop contracts
///     - @ts-nocheck is enabled to handle different contract versions with same params

// @ts-nocheck
import { AirdropNewDropEvent } from '../types/airdropNewDrop';


/// @notice Parses <LogNewDrop> events from Airdrop v1 & v2 contracts
/// @param ev the new drop event
/// @return parsed new drop in <AirdropNewDropEvent> class instance
export function parseAirdropNewDropEvent<T>(ev: T): AirdropNewDropEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new AirdropNewDropEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.address,
        ev.params.trancheId.toI32(),
        ev.params.merkleRoot,
        ev.params.totalAmount,
    )
    return event;
}
