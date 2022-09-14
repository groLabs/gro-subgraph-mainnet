// @ts-nocheck
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { DepositEvent } from '../types/deposit';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';
import { ZERO_ADDR } from '../utils/constants';


// parse core deposit events
function parseCoreDepositEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'deposit',
        ev.params.user.toHexString(),   // links with User.id,
        ZERO_ADDR,                      // from
        ev.params.user,                 // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.usdAmount,            // usdAmount
    )
    return event;
}

// parse staker deposit events
function parseStakerDepositEvent<T>(ev: T): DepositEvent {
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
    parseCoreDepositEvent,
    parseStakerDepositEvent,
}
