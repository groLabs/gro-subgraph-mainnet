// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Updates vest and claim amounts from the team vesting contract
///         in entity <Totals>

import { initTotals } from './totals';
import {
    Bytes,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Updates the total vested team amount in entity <Totals>
/// @dev - Triggered by <LogNewVest> & <LogStoppedVesting> events from GROTeamVesting
///      - amount is added when called from <LogNewVest> event
///      - amount is deducted when called from <LogStoppedVesting> event
/// @param userAddress the user address
/// @param amount the vesting amount
export const updateVestAmount = (
    userAddress: Bytes,
    amount: BigDecimal,
): void => {
    const totals = initTotals(userAddress, false);
    totals.amount_vest_team_gro = totals.amount_vest_team_gro
        .plus(amount);
    totals.save();
}

/// @notice Updates the total claimed team amount in entity <Totals>
/// @dev Triggered by <LogClaimed> events from GROTeamVesting
/// @param userAddress the user address
/// @param amount the claimed amount
export const updateClaimAmount = (
    userAddress: Bytes,
    amount: BigDecimal,
): void => {
    const totals = initTotals(userAddress, false);
    totals.amount_claim_team_gro = totals.amount_claim_team_gro
        .plus(amount);
}
