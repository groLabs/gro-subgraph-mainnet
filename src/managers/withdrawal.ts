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
///     1) Manages withdrawal events from WithdrawalHandler & GRouter contracts by:
///         - Storing the user (if not existing yet)
///         - Storing the core withdrawal transaction
///         - Updating the user's balance
///         - Updating the total supply
///         - Updating the gvt/pwrd factors
///     2) Manages withdrawal events from Staker contract by:
///         - Storing the user & totals (if not existing yet)
///         - Storing the staker withdrawal transaction
///         - Updating the pools balance

import { Log } from '../types/log';
import { setUser } from '../setters/users'
import { setPools } from '../setters/pools';
import { setTotals } from '../setters/totals';
import { initTotals } from '../setters/totals';
import { updateFactor } from '../setters/factors';
import { DepoWithdraw } from '../types/depowithdraw';
import { updateTotalSupply } from '../setters/coreData';
import {
    NUM,
    TOKEN as Token,
} from '../utils/constants';
import {
    setDepoWithdrawTx,
    setStakerDepoWithdrawTx
} from '../setters/depowithdraw';


/// @notice Manages core withdrawals from WithdrawtHandler (pre-G2) and GRouter (post-G2)
/// @param ev the parsed withdrawal event
/// @param logs the logs within the withdrawal transaction
/// @param token the withdrawal token (gvt or pwrd)
export const manageCoreWithdrawal = (
    ev: DepoWithdraw,
    logs: Log[],
    token: string
): void => {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores withdrawal tx in entity <TransferTx>
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
        tx.coin_amount.times(NUM.MINUS_ONE),
        token,
    );

    // Updates GToken factor in entity <Factor>
    if (token === Token.PWRD) {
        updateFactor(Token.PWRD);
    } else if (token === Token.GVT) {
        updateFactor(Token.GVT);
    }
}

/// @notice Manages staker withdrawals
/// @param ev the parsed withdrawal event
/// @param stakerContract the staker contract (v1, v2)
export function manageStakerWithdrawal<T>(
    ev: DepoWithdraw,
    isEmergencyWithdrawal: boolean,
    stakerContract: T,
): void {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores staker withdrawal tx in entity <TransferTx>
    const tx = setStakerDepoWithdrawTx(ev, isEmergencyWithdrawal);

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
