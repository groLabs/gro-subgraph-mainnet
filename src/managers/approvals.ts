// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Manages approval events by:
///     - Storing the user (if not existing yet)
///     - Storing the approval transaction
///     - Updating the user's balance

import { setUser } from '../setters/users';
import { initTotals } from '../setters/totals';
import { ApprovalEvent } from '../types/approval';
import { setApprovalTx } from '../setters/approvals';


/// @notice Manages approval events 
/// @param ev the parsed approval event
/// @param token the approval token (gro, gvt or pwrd)
/// @dev only handles approvals confirmed by users, but not approval
///      updates (e.g.: during deposits and withdrawals)
export const manageApproval = (
    ev: ApprovalEvent,
    token: string
): void => {
    // Creates user if not existing yet in entity <User>
    setUser(ev.ownerAddress);

    // Stores approval tx in entity <ApprovalTx>
    setApprovalTx(ev, token);

    // Creates user totals if not existing yet in entity <Totals>
    initTotals(ev.ownerAddress, true);
}
