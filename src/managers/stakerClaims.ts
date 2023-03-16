// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Manages staker claim events by:
///     - Storing the user & totals (if not existing yet)
///     - Storing the claim transaction
///     - Updating the pools balance

import { setUser } from '../setters/users';
import { setPools } from '../setters/pools';
import { StakerClaimEvent } from '../types/stakerClaim';
import { initTotals } from '../setters/totals';
import { setClaimTx } from '../setters/staker';


/// @notice Manages staker claims
/// @param ev the parsed claim event
export function manageClaim<T>(
    ev: StakerClaimEvent,
    stakerContract: T,
): void {
    // Creates user if not existing yet in entity <User>
    setUser(ev.userAddress);

    // Stores claim tx in entity <StakerClaimTx>
    const tx = setClaimTx(ev);

    // Updates user-related pool data in entity <Pool>
    // (can be multiple pools in case of <LogMultiClaim> event)
    for (let i = 0; i < ev.pid.length; i++) {
        setPools(
            tx.type,
            tx.user_address,
            ev.pid[i],
            stakerContract,
            tx.amount,
        );
    }

    // Creates user totals if not existing yet in entity <Totals>
    // (e.g.: a user that didn't do any deposit/withdrawal before claiming)
    initTotals(ev.userAddress, true);
}
