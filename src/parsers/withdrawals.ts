// @ts-nocheck
import { WithdrawalEvent } from '../types/withdrawal';


function parseWithdrawalEvent<T>(ev: T): WithdrawalEvent {
    const event = new WithdrawalEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'withdrawal',
        ev.params.user.toHexString(),  // links with User.id,
        ev.params.pid.toI32(),
        ev.params.amount,
    )
    return event;
}

export {
    parseWithdrawalEvent
}
