// @ts-nocheck
import { AirdropNewDropEvent } from '../types/airdropNewDrop';


export function parseAirdropNewDropEvent<T>(ev: T): AirdropNewDropEvent {
    const event = new AirdropNewDropEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.address,
        ev.params.trancheId.toI32(),
        ev.params.merkleRoot.toHexString(),
        ev.params.totalAmount,
    )
    return event;
}
