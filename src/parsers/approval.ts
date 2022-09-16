// @ts-nocheck
import { ApprovalEvent } from '../types/approval';

//TODO: Careful, DAI has different fields!
function parseApprovalEvent<T>(ev: T): ApprovalEvent {
    const event = new ApprovalEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number,
        ev.block.timestamp,
        ev.address,
        ev.params.owner.toHexString(),  // links with User.id
        ev.params.spender,
        ev.params.value,
    )
    return event;
}

function parseDaiApprovalEvent<T>(ev: T): ApprovalEvent {
    const event = new ApprovalEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number,
        ev.block.timestamp,
        ev.address,
        ev.params.src.toHexString(),  // links with User.id
        ev.params.guy,
        ev.params.wad,
    )
    return event;
}

export {
    parseApprovalEvent,
    parseDaiApprovalEvent,
}
