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
///     - Handles <LogVest>, <LogExit> & <LogExtend> events from
///       GROVesting v1 & v2 contracts
///     - Handles <LogInstantExit> & <LogNewInitUnlockedPercent> events from
///       GROVesting v1 contract
/// @dev
///     - GROVesting v1: 0xa28693bf01dc261887b238646bb9636cb3a3730b
///     - GROVesting v2: 0x748218256afe0a19a88ebeb2e0c5ce86d2178360

import { initMD } from '../setters/masterdata';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    LogVest as LogVestV1,
    LogExit as LogExitV1,
    LogExtend as LogExtendV1,
} from '../../generated/GROVestingV1/GROVesting';
import {
    LogVest as LogVestV2,
    LogExit as LogExitV2,
    LogInstantExit as LogInstantExitV2,
    LogExtend as LogExtendV2,
    LogNewInitUnlockedPercent as LogNewInitUnlockedPercentV2
} from '../../generated/GROVestingV2/GROVesting';
import {
    updateVest,
    updateExit,
    updateStartTime,
    updateGlobalTimeStamp,
    updateTotalLockedAmount,
    updateInitUnlockedPercent,
} from '../setters/vestingBonus';
import { tokenToDecimal } from '../utils/tokens';


/// @notice Handles <LogVest> events from GROVesting V1 contract
/// @param event the vest event
export function handleVestV1(event: LogVestV1): void {
    // Updates vesting gro & latest timestamp in entity <vestingBonus>
    updateVest(
        event.params.user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vesting.startTime
    );
    let md = initMD();
    // Updates total locked amount in entity <MasterData> (if save = true)
    md = updateTotalLockedAmount(
        md,
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        false,
    );
    // Updates global start time in entity <MasterData>
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
}

/// @notice Handles <LogVest> events from GROVesting V2 contract
/// @param event the vest event
export function handleVestV2(event: LogVestV2): void {
    // Updates vesting gro & latest timestamp in entity <vestingBonus>
    updateVest(
        event.params.user,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        event.params.vesting.startTime
    );
    let md = initMD();
    // Updates total locked amount in entity <MasterData> (if save = true)
    md = updateTotalLockedAmount(
        md,
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        false,
    );
    // Updates global start time in entity <MasterData>
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
}

/// @notice Handles <LogExit> events from GROVesting V1 contract
/// @param event the exit event
export function handleExitV1(event: LogExitV1): void {
    // Updates total bonus, total locked amount & global start time in entity <MasterData>,
    // and vesting gro in entity <VestingBonus>
    updateExit(
        event.params.user,
        event.address,
        tokenToDecimal(event.params.vesting, 18, DECIMALS),
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
        false,
    );
}

/// @notice Handles <LogExit> events from GROVesting V2 contract
/// @param event the exit event
export function handleExitV2(event: LogExitV2): void {
    // Updates total bonus, total locked amount & global start time in entity <MasterData>,
    // and vesting gro in entity <VestingBonus>
    updateExit(
        event.params.user,
        event.address,
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        tokenToDecimal(event.params.totalLockedAmount, 18, DECIMALS),
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
        false,
    );
}

/// @notice Handles <LogInstantExit> events from GROVesting V2 contract
/// @param event the instant exit event
/// @dev no amount & totalLockedAmount in LogInstantExit as in <LogExit>
export function handleInstantExitV2(event: LogInstantExitV2): void {
    // Updates total bonus & global start time in entity <MasterData>
    updateExit(
        event.params.user,
        event.address,
        NUM.ZERO,
        NUM.ZERO,
        tokenToDecimal(event.params.penalty, 18, DECIMALS),
        true,
    );
}

/// @notice Handles <LogExtend> events from GROVesting V1 contract
/// @param event the extend event
export function handleExtendV1(event: LogExtendV1): void {
    let md = initMD();
    // Updates global start time in entity <MasterData>
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
    // Updates latest start time in entity <VestingBonus>
    updateStartTime(
        event.params.user,
        event.params.newPeriod,
    );
}

/// @notice Handles <LogExtend> events from GROVesting V2 contract
/// @param event the extend event
export function handleExtendV2(event: LogExtendV2): void {
    let md = initMD();
    // Updates global start time in entity <MasterData>
    updateGlobalTimeStamp(
        md,
        event.address,
        true,
    );
    // Updates latest start time in entity <VestingBonus>
    updateStartTime(
        event.params.user,
        event.params.newPeriod,
    );
}

/// @notice Handles <LogNewInitUnlockedPercent> events from GROVesting V2 contract
/// @param event the new init unlock percent event
export function handleLogNewInitUnlockedPercentV2(
    event: LogNewInitUnlockedPercentV2
): void {
    // Updates init locked percent in entity <MasterData>
    updateInitUnlockedPercent(
        event.params.initUnlockedPercent.toBigDecimal(),
    );
}
