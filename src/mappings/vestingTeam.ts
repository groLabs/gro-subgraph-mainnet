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
///     - Handles <LogClaimed> & <LogNewVest> events from GROTeamVesting contract
///     - Currently not used but potentially to be integrated for combined gro calculation
/// @dev
///     - GROTeamVesting: 0xf43c6bdd2f9158b5a78dccf732d190c490e28644

import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { updateTeamVesting } from '../setters/vestingTeam';
import {
    LogClaimed,
    LogNewVest,
    LogStoppedVesting,
} from '../../generated/GROTeamVesting/GROTeamVesting';


/// @notice Handles <LogClaimed> events from GROTeamVesting contract
/// @param event the claim event
export function handleClaimed(event: LogClaimed): void {
    // Updates total gro team in entity <Totals>
    updateTeamVesting(
        event.params.contributor,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        false,
    );
}

/// @notice Handles <LogNewVest> events from GROTeamVesting contract
/// @param event the vest event
export function handleNewVest(event: LogNewVest): void {
    // Updates total gro team in entity <Totals>
    updateTeamVesting(
        event.params.contributor,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        true,
    );
}

export function StoppedVesting(event: LogStoppedVesting): void {
    //TODO: tbc
}