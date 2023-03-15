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
///     - Handles <LogNewVest>, <LogStoppedVesting> & <LogClaimed> events from
///       GROTeamVesting contract
///     - Currently not used but to be potentially added to the combined gro calculation
/// @dev
///     - GROTeamVesting: 0xf43c6bdd2f9158b5a78dccf732d190c490e28644

import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import {
    updateVestAmount,
    updateClaimAmount,
} from '../setters/vestingTeam';
import {
    LogClaimed,
    LogNewVest,
    LogStoppedVesting,
} from '../../generated/GROTeamVesting/GROTeamVesting';


/// @notice Handles <LogNewVest> events from GROTeamVesting contract
/// @param event the new vest event
export function handleNewVest(event: LogNewVest): void {
    updateVestAmount(
        event.params.contributor,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
    );
}

/// @notice Handles <LogStoppedVesting> events from GROTeamVesting contract
/// @param event the stop vesting event
export function handleStoppedVesting(event: LogStoppedVesting): void {
    updateVestAmount(
        event.params.contributor,
        tokenToDecimal(event.params.unlocked, 18, DECIMALS)
            .times(NUM.MINUS_ONE),
    );
}

/// @notice Handles <LogClaimed> events from GROTeamVesting contract
/// @param event the claim event
export function handleClaimed(event: LogClaimed): void {
    updateClaimAmount(
        event.params.contributor,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
    );
}
