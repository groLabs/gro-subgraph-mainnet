// @ts-nocheck
import { ApprovalEvent } from '../utils/types';

//TODO: Careful, DAI has different fields!
function parseApprovalEvent<T>(ev: T): ApprovalEvent {
    const event = new ApprovalEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.address,
        ev.params.owner.toHexString(),
        ev.params.spender,
        ev.block.number,
        ev.block.timestamp,
        ev.params.value,
    )
    return event;
}

export {
    parseApprovalEvent
}
