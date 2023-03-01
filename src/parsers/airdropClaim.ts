// @ts-nocheck
import { AirdropClaimEvent } from '../types/airdropClaim';


export function parseAirdropClaimEventV1<T>(ev: T): AirdropClaimEvent {
    const event = new AirdropClaimEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        ev.params.account.toHexString(),  // links with User.id,
        false,
        ev.params.trancheId.toI32(),
        ev.params.amount,
    )
    return event;
}

export function parseAirdropClaimEventV2<T>(ev: T): AirdropClaimEvent {
    const event = new AirdropClaimEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        ev.params.account.toHexString(),  // links with User.id,
        ev.params.vest,
        ev.params.trancheId.toI32(),
        ev.params.amount,
    )
    return event;
}
