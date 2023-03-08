// @ts-nocheck
import {
    ADDR,
    NO_POOL,
} from '../utils/constants';
import { BigInt } from '@graphprotocol/graph-ts';
import { getUSDAmountOfShare } from '../utils/tokens';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';



// TODO: user duplicated
// parse core withdrawal events
export function parseCoreWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        'core_withdrawal',
        ev.params.user,                 // links with User.id,
        ev.params.user,                 // from
        ADDR.ZERO,                      // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.returnUsd,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

export function parseGRouterWithdrawEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const shareAmount = ev.params.calcAmount;
    const tokenIndex = ev.params.tokenIndex.toI32();
    const usdAmount = getUSDAmountOfShare(tokenIndex, shareAmount.toBigDecimal());
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        'core_withdrawal',
        ev.params.sender,               // links with User.id,
        ev.params.sender,               // from
        ADDR.ZERO,                      // to
        ev.params.tokenAmount,          // coinAmount
        usdAmount,                      // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// TODO: user duplicated
// parse core withdrawal events
export function parseCoreEmergencyWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        'core_withdrawal',
        ADDR.ZERO,
        ADDR.ZERO,
        ADDR.ZERO,
        BigInt.fromString('0'),         // coinAmount
        BigInt.fromString('0'),         // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse staker withdrawal events
export function parseStakerWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const poolId = (ev.params.pid)
        ? ev.params.pid.toI32()
        : NO_POOL;
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        'staker_withdrawal',
        ev.params.user,                 // links with User.id,
        ev.address,                     // from
        ev.params.user,                 // to
        ev.params.amount,               // coinAmount
        BigInt.fromString('0'),         // usdAmount // (not needed)
        poolId,                         // poolId
    )
    return event;
}
