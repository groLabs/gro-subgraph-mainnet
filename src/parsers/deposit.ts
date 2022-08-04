// @ts-nocheck
import { DepositEvent } from '../types/deposit';


function parseDepositEvent<T>(ev: T): DepositEvent {
    const event = new DepositEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'deposit',
        ev.params.user.toHexString(),  // links with User.id,
        ev.params.pid.toI32(),
        ev.params.amount,
    )
    return event;
}

export {
    parseDepositEvent
}
