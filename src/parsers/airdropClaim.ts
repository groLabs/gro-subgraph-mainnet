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
///     - Parses claim events from Airdrop contracts
///     - One parser per event as they have different params (AssemblyScript won't 
///       handle non-existing fields)

import { AirdropClaimEvent } from '../types/airdropClaim';
import { LogClaim as LogClaimV1 } from '../../generated/AirdropV1/Airdrop';
import { LogClaim as LogClaimV2 } from '../../generated/AirdropV2/Airdrop';


/// @notice Parses <LogClaim> events from Airdrop v1 contract
/// @dev ev.params.account is foreign key to User.id
/// @param ev the claim event
/// @return parsed claim in <AirdropClaimEvent> class instance
export function parseAirdropClaimEventV1(ev: LogClaimV1): AirdropClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new AirdropClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        ev.params.account,
        false,
        ev.params.trancheId.toI32(),
        ev.params.amount,
    )
    return event;
}

/// @notice Parses <LogClaim> events from Airdrop v2 contract
/// @dev ev.params.account is foreign key to User.id
/// @param ev the claim event
/// @return parsed claim in <AirdropClaimEvent> class instance
export function parseAirdropClaimEventV2(ev: LogClaimV2): AirdropClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new AirdropClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        ev.params.account,
        ev.params.vest,
        ev.params.trancheId.toI32(),
        ev.params.amount,
    )
    return event;
}
