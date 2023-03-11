// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Parses withdrawal events from WithdrawHandler, GRouter & Staker contracts
///     - @ts-nocheck is enabled to handle different contract versions with same params

// @ts-nocheck
import {
    ADDR,
    NO_POOL,
} from '../utils/constants';
import { BigInt } from '@graphprotocol/graph-ts';
import { getUSDAmountOfShare } from '../utils/tokens';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';


/// @notice Parses <LogNewWithdrawal> events from WithdrawHandler v1, v2 & v3 contracts
/// @dev ev.params.user is foreign key to User.id
/// @param ev the withdrawal event
/// @return parsed withdrawal in <DepoWithdrawEvent> class instance
export function parseCoreWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        'core_withdrawal',
        ev.params.user,                 // FK to User.id,
        ev.params.user,                 // from
        ADDR.ZERO,                      // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.returnUsd,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

/// @notice Parses <LogWithdrawal> events from GRouter contract
/// @dev ev.params.sender is foreign key to User.id
/// @param ev the withdrawal event
/// @return parsed withdrawal in <DepoWithdrawEvent> class instance
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
        ev.params.sender,               // FK to User.id,
        ev.params.sender,               // from
        ADDR.ZERO,                      // to
        ev.params.tokenAmount,          // coinAmount
        usdAmount,                      // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

/// @notice Parses <LogEmergencyWithdrawal> events from EmergencyHandler contract
/// @dev Event is emitted without data- user is retrieved afterwards through tx logs
/// @param ev the emergency withdrawal event
/// @return parsed emergency withdrawal in <DepoWithdrawEvent> class instance
export function parseCoreEmergencyWithdrawalEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        'core_withdrawal',
        ADDR.ZERO,                      // FK to User.id,
        ADDR.ZERO,                      // from
        ADDR.ZERO,                      // to
        BigInt.fromString('0'),         // coinAmount
        BigInt.fromString('0'),         // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

/// @notice Parses <LogWithdraw> & <LogEmergencyWithdraw> events from 
///         Staker v1 & v2 contracts
/// @dev ev.params.user is foreign key to User.id
/// @param ev the withdrawal event
/// @return parsed withdrawal in <DepoWithdrawEvent> class instance
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
        ev.params.user,                 // FK to User.id,
        ev.address,                     // from
        ev.params.user,                 // to
        ev.params.amount,               // coinAmount
        BigInt.fromString('0'),         // usdAmount (not needed)
        poolId,                         // poolId
    )
    return event;
}
