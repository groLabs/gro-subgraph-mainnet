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
///     - Handles <LogClaim>, <LogDeposit>, <LogWithdraw>, <LogAddPool>, <LogSetPool>,
///       <LogUpdatePool>, <LogGroPerBlock> & <LogEmergencyWithdraw> events from
///       Staker v1 & v2 contracts
///     - Handles <LogMultiClaim> events from Staker v2 contracts
/// @dev
///     - Staker v1: 0x001c249c09090d79dc350a286247479f08c7aad7
///     - Staker v1: 0x2e32bad45a1c29c1ea27cf4dd588df9e68ed376c


import { parseLogEvent } from '../parsers/log';
import { manageClaim } from '../managers/stakerClaims';
import { parseStakerDepositEvent } from '../parsers/deposit';
import { parseStakerWithdrawalEvent } from '../parsers/withdrawals';
import { manageStakerDeposit } from '../managers/deposit';
import { manageStakerWithdrawal } from '../managers/withdrawal';
import { LpTokenStaker as LpTokenStakerV1 } from '../../generated/LpTokenStakerV1/LpTokenStaker';
import { LpTokenStaker as LpTokenStakerV2 } from '../../generated/LpTokenStakerV2/LpTokenStaker';
import {
    staker1Address,
    staker2Address,
} from '../utils/contracts';
import {
    parseClaimV1Event,
    parseClaimV2Event,
    parseMultiClaimV2Event,
} from '../parsers/stakerClaim';
import {
    updateStakerSupply,
    updateStakerAllocation,
    updateStakerGroPerBlock,
} from '../setters/staker';
import {
    LogClaim as LogClaimV1,
    LogDeposit as LogDepositV1,
    LogWithdraw as LogWithdrawV1,
    LogAddPool as LogAddPoolV1,
    LogSetPool as LogSetPoolV1,
    LogUpdatePool as LogUpdatePoolV1,
    LogGroPerBlock as LogGroPerBlockV1,
    LogEmergencyWithdraw as LogEmergencyWithdrawV1
} from '../../generated/LpTokenStakerV1/LpTokenStaker';
import {
    LogClaim as LogClaimV2,
    LogMultiClaim as LogMultiClaimV2,
    LogDeposit as LogDepositV2,
    LogWithdraw as LogWithdrawV2,
    LogAddPool as LogAddPoolV2,
    LogSetPool as LogSetPoolV2,
    LogUpdatePool as LogUpdatePoolV2,
    LogGroPerBlock as LogGroPerBlockV2,
    LogEmergencyWithdraw as LogEmergencyWithdrawV2,
} from '../../generated/LpTokenStakerV2/LpTokenStaker';

const LpTokenStakerV1contract = LpTokenStakerV1.bind(staker1Address);
const LpTokenStakerV2contract = LpTokenStakerV2.bind(staker2Address);


/// @notice Handles <LogClaim> events from Staker v1 contract
/// @param event the claim event
export function handleClaimV1(event: LogClaimV1): void {
    const ev = parseClaimV1Event(event);
    manageClaim(
        ev,
        LpTokenStakerV1contract,
    );
}

/// @notice Handles <LogClaim> events from Staker v2 contract
/// @param event the claim event
export function handleClaimV2(event: LogClaimV2): void {
    const ev = parseClaimV2Event(event);
    manageClaim(
        ev,
        LpTokenStakerV2contract,
    );
}

/// @notice Handles <LogMultiClaim> events from Staker v2 contract
/// @param event the multi-claim event
export function handleMultiClaimV2(event: LogMultiClaimV2): void {
    const ev = parseMultiClaimV2Event(event);
    manageClaim(
        ev,
        LpTokenStakerV2contract,
    );
}

/// @notice Handles <LogDeposit> events from Staker v1 contract
/// @param event the deposit event
export function handleDepositV1(event: LogDepositV1): void {
    const ev = parseStakerDepositEvent(event);
    manageStakerDeposit(
        ev,
        LpTokenStakerV1contract,
    );
}

/// @notice Handles <LogDeposit> events from Staker v2 contract
/// @param event the deposit event
export function handleDepositV2(event: LogDepositV2): void {
    const ev = parseStakerDepositEvent(event);
    manageStakerDeposit(
        ev,
        LpTokenStakerV2contract,
    );
}

/// @notice Handles <LogWithdraw> events from Staker v1 contract
/// @param event the withdrawal event
export function handleWithdrawV1(event: LogWithdrawV1): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(
        ev,
        false,
        LpTokenStakerV1contract,
    );
}

/// @notice Handles <LogWithdraw> events from Staker v2 contract
/// @param event the withdrawal event
export function handleWithdrawV2(event: LogWithdrawV2): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(
        ev,
        false,
        LpTokenStakerV2contract,
    );
}

/// @notice Handles <LogEmergencyWithdraw> events from Staker v1 contract
/// @param event the emergency withdrawal event
export function handleEmergencyWithdrawV1(event: LogEmergencyWithdrawV1): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(
        ev,
        true,
        LpTokenStakerV1contract,
    );
}

/// @notice Handles <LogEmergencyWithdraw> events from Staker v2 contract
/// @param event the emergency withdrawal event
export function handleEmergencyWithdrawV2(event: LogEmergencyWithdrawV2): void {
    const ev = parseStakerWithdrawalEvent(event);
    manageStakerWithdrawal(
        ev,
        true,
        LpTokenStakerV2contract,
    );
}

/// @notice Handles <LogAddPool> events from Staker v1 contract
/// @param event the add pool event
export function handleAddPoolV1(event: LogAddPoolV1): void {
    // Updates allocation point & pool share in entity <StakerData>
    // and total allocation in entity <MasterData>
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

/// @notice Handles <LogAddPool> events from Staker v2 contract
/// @param event the add pool event
export function handleAddPoolV2(event: LogAddPoolV2): void {
    // Updates allocation point & pool share in entity <StakerData>
    // and total allocation in entity <MasterData>
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

/// @notice Handles <LogSetPool> events from Staker v1 contract
/// @param event the set pool event
export function handleSetPoolV1(event: LogSetPoolV1): void {
    // Updates allocation point & pool share in entity <StakerData>
    // and total allocation in entity <MasterData>
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

/// @notice Handles <LogSetPool> events from Staker v2 contract
/// @param event the set pool event
export function handleSetPoolV2(event: LogSetPoolV2): void {
    // Updates allocation point & pool share in entity <StakerData>
    // and total allocation in entity <MasterData>
    updateStakerAllocation(
        event.params.pid,
        event.params.allocPoint,
    );
}

/// @notice Handles <LogUpdate> events from Staker v1 contract
/// @param event the update pool event
export function handleUpdatePoolV1(event: LogUpdatePoolV1): void {
    const logs = parseLogEvent(event.receipt!.logs);
    // Updates lp supply, acc gro per share, block number
    // and block timestamp in entity <StakerData>
    updateStakerSupply(
        event.params.pid,
        event.params.lpSupply,
        event.params.accGroPerShare,
        event.block.number,
        event.block.timestamp,
        logs,
    );
}

/// @notice Handles <LogUpdate> events from Staker v2 contract
/// @param event the update pool event
export function handleUpdatePoolV2(event: LogUpdatePoolV2): void {
    const logs = parseLogEvent(event.receipt!.logs);
    // Updates lp supply, acc gro per share, block number
    // and block timestamp in entity <StakerData>
    updateStakerSupply(
        event.params.pid,
        event.params.lpSupply,
        event.params.accGroPerShare,
        event.block.number,
        event.block.timestamp,
        logs,
    );
}

/// @notice Handles <LogGroPerBlock> events from Staker v1 contract
/// @param event the gro per block event
export function handleGroPerBlockV1(event: LogGroPerBlockV1): void {
    // Updates gro per block in entity <MasterData>
    updateStakerGroPerBlock(event.params.newGro);
}

/// @notice Handles <LogGroPerBlock> events from Staker v2 contract
/// @param event the gro per block event
export function handleGroPerBlockV2(event: LogGroPerBlockV2): void {
    // Updates gro per block in entity <MasterData>
    updateStakerGroPerBlock(event.params.newGro);
}
