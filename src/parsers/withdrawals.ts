// @ts-nocheck
import { WithdrawalEvent } from '../types/withdrawal';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';
import { ZERO_ADDR } from '../utils/constants';
import { BigInt } from '@graphprotocol/graph-ts';


// parse core withdrawal events
function parseCoreWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_withdrawal',
        ev.params.user.toHexString(),   // links with User.id,
        ev.params.user,                 // from
        ZERO_ADDR,                      // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.returnUsd,            // usdAmount
    )
    return event;
}

// parse staker withdrawal events
function parseStakerWithdrawalEvent<T>(ev: T): WithdrawalEvent {
    const event = new WithdrawalEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'staker_withdrawal',
        ev.params.user.toHexString(),  // links with User.id,
        ev.params.pid.toI32(),
        ev.params.amount,
    )
    return event;
}

export {
    parseCoreWithdrawalEvent,
    parseStakerWithdrawalEvent,
}
