// @ts-nocheck
import { BigInt } from '@graphprotocol/graph-ts';
import { ClaimEvent } from '../types/claim';


// @dev: parsing functions must be different per event type; otherwise, AssemblyScript
//       will complain on non-existing functions from an event

export function parseClaimV1Event<T>(ev: T): ClaimEvent {
    const event = new ClaimEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'claim',
        ev.params.user.toHexString(),  // links with User.id,
        false,
        [ev.params.pid.toI32()],
        ev.params.amount,
    )
    return event;
}

export function parseClaimV2Event<T>(ev: T): ClaimEvent {
    const event = new ClaimEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'claim',
        ev.params.user.toHexString(),  // links with User.id,
        ev.params.vest,
        [ev.params.pid.toI32()],
        ev.params.amount,
    )
    return event;
}

export function parseMultiClaimV2Event<T>(ev: T): ClaimEvent {
    const event = new ClaimEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'multiclaim',
        ev.params.user.toHexString(),  // links with User.id,
        ev.params.vest,
        ev.params.pids.map<i32>((pid: BigInt): i32 => pid.toI32()),
        ev.params.amount,
    )
    return event;
}
