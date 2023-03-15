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
///     - Initialises entity <VestingBonus> and updates amount, rewards & timestamp
///     - Updates total bonus, locked amount, initial unlocked percent & global start
///       time in entity <MasterData>

import { initMD } from './masterdata';
import { NUM } from '../utils/constants';
import {
    MasterData,
    VestingBonus,
} from '../../generated/schema';
import {
    log,
    Bytes,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <VestingBonus> with default values if not created yet
/// @param userAddress the user address
/// @param save stores the entity if true; doesn't store it otherwise
/// @return vesting bonus object from entity <VestingBonus>
export const initVestingBonus = (
    userAddress: Bytes,
    save: boolean,
): VestingBonus => {
    const id = userAddress;
    let vestingBonus = VestingBonus.load(id);
    if (!vestingBonus) {
        vestingBonus = new VestingBonus(id);
        vestingBonus.user_address = userAddress;
        vestingBonus.net_reward = NUM.ZERO;
        vestingBonus.vesting_gro = NUM.ZERO;
        vestingBonus.latest_start_time = 0;
        if (save)
            vestingBonus.save();
    }
    return vestingBonus;
}

/// @notice Updates the net reward in entity <VestingBonus>
/// @dev - Triggered by <LogBonusClaimed> event from GROHodler contracts
///      - If vest=true, all bonus claim is added to rewards; otherwise, the 30% is added
///      - Claiming bonus without vesting is only available in GROHodler v2
/// @param userAddress the user address
/// @param _amount the bonus claim amount
/// @param vest the vest flag (true, false)
export const updateNetReward = (
    userAddress: Bytes,
    _amount: BigDecimal,
    vest: boolean,
): void => {
    const vestingBonus = initVestingBonus(userAddress, false);
    const amount = (vest)
        ? _amount
        : _amount.times(NUM.THIRTY_PERCENT);
    vestingBonus.net_reward = vestingBonus.net_reward.plus(amount);
    vestingBonus.save();
}

/// @notice Updates the vesting amount in entity <VestingBonus>
/// @dev Triggered by <LogVest> event from GROVesting contracts
/// @param userAddress the user address
/// @param amount the vesting amount
/// @param latestStartTime the vesting start time
export const updateVest = (
    userAddress: Bytes,
    amount: BigDecimal,
    latestStartTime: BigInt,
): void => {
    const vestingBonus = initVestingBonus(userAddress, false);
    vestingBonus.vesting_gro = vestingBonus.vesting_gro.plus(amount);
    vestingBonus.latest_start_time = latestStartTime.toI32();
    vestingBonus.save();
}

/// @notice Updates the start time in entity <VestingBonus>
/// @dev Triggered by <LogExtend> event from GROVesting contracts
/// @param userAddress the user address
/// @param latestStartTime the vesting start time
export const updateStartTime = (
    userAddress: Bytes,
    latestStartTime: BigInt,
): void => {
    const vestingBonus = initVestingBonus(userAddress, false);
    vestingBonus.latest_start_time = latestStartTime.toI32();
    vestingBonus.save();
}

/// @notice Updates the total locked amount in entity <MasterData>
/// @dev Triggered by <LogVest> events from GROVesting contract
/// @param md the MasterData entity
/// @param amount the total locked amount
/// @param save stores the entity if true; doesn't store it otherwise
/// @return MasterData object
export const updateTotalLockedAmount = (
    md: MasterData,
    amount: BigDecimal,
    save: boolean,
): MasterData => {
    if (amount.ge(NUM.ZERO))
        md.total_locked_amount = amount;
    if (save)
        md.save();
    return md;
}

/// @notice Updates the total bonus in entity <MasterData>
/// @dev: Triggered by the following contract events:
///         - <LogBonusClaimed> from GROHodler
///         - <LogExit> & <LogInstantExit> from GROVesting
/// @param bonusAmount the bonus amount from a claim or penalty amount from an exit
/// @param save stores the entity if true; doesn't store it otherwise
/// @return MasterData object
export const updateTotalBonus = (
    bonusAmount: BigDecimal,
    save: boolean,
): MasterData => {
    let md = initMD();
    md.total_bonus = md.total_bonus.plus(bonusAmount);
    if (bonusAmount.ge(NUM.ZERO)) {
        md.total_bonus_in = md.total_bonus_in.plus(bonusAmount);
    } else {
        md.total_bonus_out = md.total_bonus_out.plus(bonusAmount);
    }
    if (save)
        md.save();
    return md;
}

/// @notice Updates the global start time in entity <MasterData>
/// @dev: Triggered by <LogVest>, <LogExtend>, <LogExit> & <LogInstantExit>
///       events from GROVesting contracts
/// @param md the MasterData entity
/// @param vestingContract the vesting contract (v1 or v2)
/// @param save stores the entity if true; doesn't store it otherwise
/// @return MasterData object
export function updateGlobalTimeStamp<T>(
    md: MasterData,
    vestingContract: T,
    save: boolean,
): MasterData {
    //@ts-ignore
    const globalStartTime = vestingContract.try_globalStartTime();
    if (globalStartTime.reverted) {
        log.error(
            'updateGlobalTimeStamp(): try_globalStartTime() on vesting reverted in /setters/vestingBonus.ts',
            [],
        );
    } else {
        md.global_start_time = globalStartTime.value.toI32();
    }
    if (save)
        md.save();
    return md;
}

/// @notice
///     - Updates total bonus, total locked amount & global start time
///       in entity <MasterData>
///     - Updates vesting amount in entity <VestingBonus>
/// @dev: Triggered by <LogExit> & <LogInstantExit> events from GROVesting
/// @param userAddress the user address
/// @param vestingContract the vesting contract (v1, v2)
/// @param vestingAmount the vesting amount
/// @param totalLockedAmount the total locked amount
/// @param penaltyAmount the penalty amount
/// @param isInstantExit true if function is called from an <LogInstantExit> event
export function updateExit<T>(
    userAddress: Bytes,
    vestingContract: T,
    vestingAmount: BigDecimal,
    totalLockedAmount: BigDecimal,
    penaltyAmount: BigDecimal,
    isInstantExit: boolean,
): void {
    // Updates total_bonus
    let md = updateTotalBonus(
        penaltyAmount,
        false,
    );
    // Updates total_locked_amount
    if (!isInstantExit && totalLockedAmount.ge(NUM.ZERO))
        md.total_locked_amount = totalLockedAmount;

    // Updates global_start_time (Groove)
    md = updateGlobalTimeStamp(
        md,
        vestingContract,
        false
    );
    // Updates vesting_gro
    if (!isInstantExit) {
        let vestingBonus = initVestingBonus(userAddress, false);
        vestingBonus.vesting_gro = vestingBonus.vesting_gro
            .minus(vestingAmount);
        vestingBonus.save();
    }
    md.save();
}

/// @notice Updates the init unlocked percent in entity <MasterData>
/// @dev: Triggered by <LogNewInitUnlockedPercent> event from GROVesting v2
/// @param amount the init unlocked percent
export const updateInitUnlockedPercent = (
    amount: BigDecimal
): void => {
    let md = initMD();
    md.init_unlocked_percent = amount.div(BigDecimal.fromString('10000'));
    md.save();
}
