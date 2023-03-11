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
///     - Handles <LogBonusClaimed> events from GROHodler v1 & v2 contracts
/// @dev
///     - GROHodler v1: 0xef10eac205817a88c6d504d02481053e85a8f927
///     - GROHodler v2: 0x8b4a30c8884ca4aff1e4c82cce79802a63e61397

import { tokenToDecimal } from '../utils/tokens';
import { LogBonusClaimed as LogBonusClaimedV1 } from '../../generated/GROHodlerV1/GROHodler';
import { LogBonusClaimed as LogBonusClaimedV2 } from '../../generated/GROHodlerV2/GROHodler';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    updateNetReward,
    updateTotalBonus,
} from '../setters/vestingBonus';


/// @notice Handles <LogBonusClaimed> events from GROHodler v1 contract
/// @param event the claim event
export function handleBonusClaimedV1(event: LogBonusClaimedV1): void {
    // Updates net reward in entity <VestingBonus>
    updateNetReward(
        event.params.user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        true,
    );
    // Updates total bonus in entity <MasterData>
    updateTotalBonus(
        tokenToDecimal(event.params.amount, 18, DECIMALS)
            .times(NUM.MINUS_ONE),
        true,
    );
}

/// @notice Handles <LogBonusClaimed> events from GROHodler v2 contract
/// @param event the claim event
export function handleBonusClaimedV2(event: LogBonusClaimedV2): void {
    // Updates net reward in entity <VestingBonus>
    updateNetReward(
        event.params.user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vest,
    );
    // Updates total bonus in entity <MasterData>
    updateTotalBonus(
        tokenToDecimal(event.params.amount, 18, DECIMALS)
            .times(NUM.MINUS_ONE),
        true,
    );
}
