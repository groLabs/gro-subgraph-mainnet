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
///     - Parses transaction logs from DepositHandler, EmergencyHandler, Gvt, PnL, Pwrd,
///       Staker & WithdrawalHandler contracts
///     - @ts-nocheck is enabled to handle different transaction log versions

// @ts-nocheck
import { Log } from '../types/log';


/// @notice Parses logs from a given transaction
/// @param ev the tx logs event
/// @return parsed logs in <Log> class instance
export function parseLogEvent<T>(ev: T[]): Log[] {
    let logs = new Array<Log>(0);
    for (let i=0; i<ev.length; i++) {
        const log = new Log(
            ev[i].address,
            ev[i].topics,
            ev[i].data,
            ev[i].blockHash,
            ev[i].blockNumber,
            ev[i].transactionHash,
            ev[i].transactionIndex,
            ev[i].logIndex,
            ev[i].transactionLogIndex,
            ev[i].logType,
            false,
        )
        logs.push(log);
    }
    return logs;
}
