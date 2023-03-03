// @ts-nocheck
import { AirdropNewDropEvent } from '../types/airdropNewDrop';


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
