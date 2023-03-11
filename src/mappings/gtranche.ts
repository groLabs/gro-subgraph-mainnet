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
///     - Handles <LogNewTrancheBalance> & <LogNewUtilisationThreshold> events
///       from GTranche contract
/// @dev
///     - GTranche: 0x19a07afe97279cb6de1c9e73a13b7b0b63f7e67a

import { tokenToDecimal } from '../utils/tokens';
import {
    setUtilizationRatio,
    setUtilizationRatioLimit,
} from '../setters/gtranche';
import {
    LogNewTrancheBalance,
    LogNewUtilisationThreshold,
} from '../../generated/GTranche/GTranche';


/// @notice Handles <LogNewTrancheBalance> events from GTranche contract
/// @param event the new tranche balance event
export function handleNewTrancheBalance(event: LogNewTrancheBalance): void {
    const utilRatio = tokenToDecimal(event.params._utilisation, 4, 4);
    // Updates the utilisation ratio in entity <MasterData>
    setUtilizationRatio(utilRatio);
}

/// @notice Handles <LogNewUtilisationThreshold> events from GTranche contract
/// @param event the new utilisation threshold event
export function handleLogNewUtilisationThreshold(event: LogNewUtilisationThreshold): void {
    const utilRatioLimit = tokenToDecimal(event.params.newThreshold, 4, 4);
    // Updates the util ratio limit in entity <MasterData>
    setUtilizationRatioLimit(utilRatioLimit);
}
