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
///     - Handles <LogStrategyUpdated> events from StopLossLogic contract
/// @dev
///     - StopLossLogic: 0x2b369ba27174a3c33a3922340ccd3e937aef4470

import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { setStopLossLogic } from '../setters/stratsGVault';
import { LogStrategyUpdated } from '../../generated/StopLossLogic/StopLossLogic';


/// @notice Handles <LogStrategyUpdated> events from StopLossLogic contract
/// @param event the strategy updated event
export function handleLogStrategyUpdated(event: LogStrategyUpdated): void {
    setStopLossLogic(
        event.params.strategy,
        tokenToDecimal(event.params.equilibriumValue, 18, DECIMALS),
        event.params.healthThreshold.toI32(),
    );
}
