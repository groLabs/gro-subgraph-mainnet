// @ts-nocheck
import { TransferEvent } from '../types/transfer';


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
