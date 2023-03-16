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
///     1) Manages deposit events from DepositHandler & GRouter contracts by:
///         - Storing the user (if not existing yet)
///         - Storing the core deposit transaction
///         - Updating the user's balance
///         - Updating the total supply
///     2) Manages deposit events from Staker contract by:
///         - Storing the user & totals (if not existing yet)
///         - Storing the staker deposit transaction
///         - Updating the pools balance

import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
import {
    setDepoWithdrawTx,
    setStakerDepoWithdrawTx,
} from '../setters/depowithdraw';


/// @notice Manages core deposits from DepositHandler (pre-G2) and GRouter (post-G2)
/// @param ev the parsed deposit event
/// @param logs the logs within the deposit transaction
/// @param token the deposit token (gvt or pwrd)
export const manageCoreDeposit = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores deposit tx in entity <TransferTx>
    const tx = setDepoWithdrawTx(ev, logs, token);

    // Updates user totals in entity <Totals>
    setTotals(
        tx.type,
        token,
        ev.userAddress,
        tx.coin_amount,
        tx.usd_amount,
        tx.factor,
    );

    // Updates total supply in entity <CoreData>
    updateTotalSupply(
        tx.coin_amount,
        token,
    );
}

/// @notice Manages staker deposits
/// @param ev the parsed deposit event
/// @param stakerContract the staker contract (v1, v2)
export function manageStakerDeposit<T>(
    ev: DepoWithdraw,
    stakerContract: T,
): void {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores staker deposit tx in entity <TransferTx>
    const tx = setStakerDepoWithdrawTx(ev, false);

    // Updates user-related pool data in entity <Pool>
    setPools(
        tx.type,
        tx.user_address,
        tx.pool_id,
        stakerContract,
        tx.coin_amount,
    );

    // Creates user totals if not existing yet in entity <Totals>
    // (e.g.: a user that didn't do any deposit/withdrawal before staking)
    initTotals(ev.userAddress, true);
}
