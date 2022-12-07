// @ts-nocheck
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';
import {
    ADDR,
    NO_POOL,
} from '../utils/constants';
import { amountToUsd } from "../utils/tokens";


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
        ADDR.ZERO,                      // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.returnUsd,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

function parseGRouterWithdrawEvent<T>(ev: T): DepoWithdrawEvent {
    const shareAmount = ev.params.calcAmount;
    let tokenIndex = ev.params.tokenIndex.toI32();
    let usdAmount = getUSDAmountOfShare(tokenIndex, shareAmount.toBigDecimal());
    if(tokenIndex == 1 || tokenIndex == 2){
        const addedDecimals = BigInt.fromI32(10)
           .pow(12);
        usdAmount = usdAmount.times(addedDecimals);
    } 
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_withdrawal',
        ev.params.sender.toHexString(),   // links with User.id,
        ev.params.sender,                 // from
        ADDR.ZERO,                      // to
        ev.params.tokenAmount,         // coinAmount
        usdAmount,                     // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse core withdrawal events
function parseCoreEmergencyWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'core_withdrawal',
        '',
        ADDR.ZERO,
        ADDR.ZERO,
        BigInt.fromString('0'),         // coinAmount
        BigInt.fromString('0'),         // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

// parse staker withdrawal events
function parseStakerWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const poolId = (ev.params.pid)
        ? ev.params.pid.toI32()
        : NO_POOL;
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.toHex() + "-" + ev.logIndex.toString(),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.address,
        'staker_withdrawal',
        ev.params.user.toHexString(),   // links with User.id,
        ev.address,                     // from
        ev.params.user,                 // to
        ev.params.amount,               // coinAmount
        BigInt.fromString('0'),         // usdAmount // TODO **************************
        poolId,                         // poolId
    )
    return event;
}

function getUSDAmountOfShare(tokenIndex: number, coinAmount:BigDecimal): BigInt {
    let usdAmount = BigDecimal.zero();
    if(tokenIndex == 0){
        usdAmount = amountToUsd("dai", coinAmount);
    } else if(tokenIndex == 1){
        usdAmount = amountToUsd("usdc", coinAmount);
    } else if(tokenIndex == 2) {
        usdAmount = amountToUsd("usdt", coinAmount);
    } else {
        usdAmount = amountToUsd("3crv", coinAmount);
    }

    return BigInt.fromString(usdAmount.truncate(0).toString());
}

export {
    parseCoreWithdrawalEvent,
    parseStakerWithdrawalEvent,
    parseCoreEmergencyWithdrawalEvent,
    parseGRouterWithdrawEvent
}
