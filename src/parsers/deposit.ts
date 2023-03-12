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
///     - Parses deposit events from DepositHandler, GRouter & Staker contracts
///     - @ts-nocheck is enabled to handle different contract versions with same params

// @ts-nocheck
import { BigInt } from '@graphprotocol/graph-ts';
import { DepoWithdraw as DepoWithdrawEvent } from '../types/depowithdraw';
import { 
    ADDR,
    NO_POOL,
    TX_TYPE as TxType,
} from '../utils/constants';


/// @notice Parses <LogNewDeposit> events from DepositHandler v1, v2 & v3 contracts
/// @dev ev.params.user is foreign key to User.id
/// @param ev the deposit event
/// @return parsed deposit in <DepoWithdrawEvent> class instance
export function parseCoreDepositEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        TxType.CORE_DEPOSIT,
        ev.params.user,                 // FK to User.id,
        ADDR.ZERO,                      // from
        ev.params.user,                 // to
        BigInt.fromString('0'),         // coinAmount
        ev.params.usdAmount,            // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

/// @notice Parses <LogDeposit> & <LogLegacyDeposit> events from GRouter contract
/// @dev ev.params.sender is foreign key to User.id
/// @param ev the deposit event
/// @return parsed deposit in <DepoWithdrawEvent> class instance
export function parseGRouterDepositEvent<T>(ev: T): DepoWithdrawEvent {
    const logIndex = ev.logIndex.toI32();
    const event = new DepoWithdrawEvent(
        ev.transaction.hash.concatI32(logIndex),
        ev.block.number.toI32(),
        ev.block.timestamp.toI32(),
        ev.transaction.hash,
        ev.address,
        TxType.CORE_DEPOSIT,
        ev.params.sender,               // FK to User.id,
        ADDR.ZERO,                      // from
        ev.params.sender,               // to
        ev.params.trancheAmount,        // coinAmount
        ev.params.calcAmount,           // usdAmount
        NO_POOL,                        // poolId
    )
    return event;
}

/// @notice Parses <LogDeposit> events from Staker v1 & v2 contracts
/// @dev ev.params.user is foreign key to User.id
/// @param ev the deposit event
/// @return parsed deposit in <DepoWithdrawEvent> class instance
export function parseStakerDepositEvent<T>(ev: T): DepoWithdrawEvent {
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
        TxType.STAKER_DEPOSIT,
        ev.params.user,                 // FK to User.id,
        ev.params.user,                 // from
        ev.address,                     // to
        ev.params.amount,               // coinAmount
        BigInt.fromString('0'),         // usdAmount (TODO)
        poolId,                         // poolId
    )
    return event;
}
