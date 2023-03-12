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
///     - Parses claim events from Staker contracts
///     - One parser per event as they have different params (AssemblyScript won't 
///       handle non-existing fields)

import { BigInt } from '@graphprotocol/graph-ts';
import { TX_TYPE as TxType } from '../utils/constants';
import { StakerClaimEvent } from '../types/stakerClaim';
import {
    LogClaim as LogClaimV1,
} from '../../generated/LpTokenStakerV1/LpTokenStaker';
import {
    LogClaim as LogClaimV2,
    LogMultiClaim as LogMultiClaimV2,
} from '../../generated/LpTokenStakerV2/LpTokenStaker';


/// @notice Parses <LogClaim> events from Staker v1 contract
/// @dev ev.params.user is foreign key to User.id
/// @param ev the claim event
/// @return parsed claim in <StakerClaimEvent> class instance
export function parseClaimV1Event(ev: LogClaimV1): StakerClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new StakerClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        TxType.CLAIM,
        ev.params.user,
        false,
        [ev.params.pid.toI32()],
        ev.params.amount,
    )
    return event;
}

/// @notice Parses <LogClaim> events from Staker v2 contract
/// @dev ev.params.user is foreign key to User.id
/// @param ev the claim event
/// @return parsed claim in <StakerClaimEvent> class instance
export function parseClaimV2Event(ev: LogClaimV2): StakerClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new StakerClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        TxType.CLAIM,
        ev.params.user,
        ev.params.vest,
        [ev.params.pid.toI32()],
        ev.params.amount,
    )
    return event;
}

/// @notice Parses <LogMultiClaim> events from Staker v2 contract
/// @dev ev.params.user is foreign key to User.id
/// @param ev the multi-claim event
/// @return parsed multi-claim in <StakerClaimEvent> class instance
export function parseMultiClaimV2Event(ev: LogMultiClaimV2): StakerClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new StakerClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        TxType.MULTICLAIM,
        ev.params.user,
        ev.params.vest,
        ev.params.pids.map<i32>((pid: BigInt): i32 => pid.toI32()),
        ev.params.amount,
    )
    return event;
}
