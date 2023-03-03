// @ts-nocheck
import { AirdropClaimEvent } from '../types/airdropClaim';


export function parseAirdropClaimEventV1<T>(ev: T): AirdropClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new AirdropClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        ev.params.account,  // links with User.id,
        false,
        ev.params.trancheId.toI32(),
        ev.params.amount,
    )
    return event;
}

export function parseAirdropClaimEventV2<T>(ev: T): AirdropClaimEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new AirdropClaimEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        ev.params.account,  // links with User.id,
        ev.params.vest,
        ev.params.trancheId.toI32(),
        ev.params.amount,
    )
    return event;
}
