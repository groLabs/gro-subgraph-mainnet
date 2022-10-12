// @ts-nocheck
import { TransferEvent } from '../types/transfer';


function parseTransferEvent<T>(ev: T): TransferEvent {
    const event = new TransferEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number,
        ev.block.timestamp,
        ev.address,
        ev.params.from,
        ev.params.to,
        ev.params.value,
    )
    return event;
}

export {
    parseTransferEvent
}
