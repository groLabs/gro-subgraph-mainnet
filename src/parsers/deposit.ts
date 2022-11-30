// @ts-nocheck
import { BigInt } from '@graphprotocol/graph-ts';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';
import {
    ADDR,
    NO_POOL,
} from '../utils/constants';


// parse core deposit events
function parseCoreDepositEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_deposit',
        ev.params.user.toHexString(),   // links with User.id,
        ADDR.ZERO,                      // from
        ev.params.user,                 // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.usdAmount,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse core deposit events
function parseGRouterDepositEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_deposit',
        ev.params.sender.toHexString(),   // links with User.id,
        ADDR.ZERO,                      // from
        ev.params.sender,                 // to
        ev.params.trancheAmount,      // coinAmount
        ev.params.calcAmount,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse staker deposit events
function parseStakerDepositEvent<T>(ev: T): DepoWithdrawEvent {
    const poolId = (ev.params.pid)
        ? ev.params.pid.toI32()
        : NO_POOL;
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'staker_deposit',
        ev.params.user.toHexString(),   // links with User.id,
        ev.params.user,                 // from
        ev.address,                     // to
        ev.params.amount,               // coinAmount
        BigInt.fromString('0'),         // usdAmount // TODO **************************
        poolId,                         // poolId
    )
    return event;
}

export {
    parseCoreDepositEvent,
    parseStakerDepositEvent,
    parseGRouterDepositEvent
}
