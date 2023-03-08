import { initMD } from './masterdata';
import { NUM } from '../utils/constants';
import { GROVesting as GROVestingV1 } from '../../generated/GROVestingV1/GROVesting';
import { GROVesting as GROVestingV2 } from '../../generated/GROVestingV2/GROVesting';
import {
    MasterData,
    VestingBonus,
} from '../../generated/schema';
import {
    vesting1Address,
    vesting2Address,
} from '../utils/contracts';
import {
    log,
    Bytes,
    BigInt,
    Address,
    BigDecimal,

} from '@graphprotocol/graph-ts';


export const initVestingBonus = (
    userAddress: Bytes,
    save: boolean,
): VestingBonus => {
    const id = userAddress;
    let vestingBonus = VestingBonus.load(id);
    if (!vestingBonus) {
        vestingBonus = new VestingBonus(id);
        vestingBonus.user_address = userAddress;
        vestingBonus.locked_gro = NUM.ZERO;  //TODO: never updated -> to be removed
        vestingBonus.net_reward = NUM.ZERO;
        vestingBonus.claim_now = NUM.ZERO;
        vestingBonus.vest_all = NUM.ZERO;
        vestingBonus.vesting_gro = NUM.ZERO;
        vestingBonus.latest_start_time = 0;
        if (save)
            vestingBonus.save();
    }
    return vestingBonus;
}

// Event <BonusClaimed> from GROHodler
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

// Event <LogVest> from GROVesting
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

export const updateStartTime = (
    userAddress: Bytes,
    latestStartTime: BigInt,
): void => {
    const vestingBonus = initVestingBonus(userAddress, false);
    vestingBonus.latest_start_time = latestStartTime.toI32();
    vestingBonus.save();
}

// Event <LogVest> & <LogExit> from GROVesting
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

// Event <LogExit>, <LogInstantExit> from GROVesting
// Event <LogBonusClaimed> from GROHodler
export const updateTotalBonus = (
    md: MasterData,
    bonusAmount: BigDecimal,
    save: boolean,
): MasterData => {
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

// Event <LogVest>, <LogExit>, <LogInstantExit> & <LogExtend> from GROVesting
export const updateGlobalTimeStamp = (
    md: MasterData,
    vestingAddress: Bytes,
    save: boolean,
): MasterData => {
    if (vestingAddress == vesting1Address) {
        const contract = GROVestingV1.bind(Address.fromBytes(vestingAddress));
        const globalStartTime = contract.try_globalStartTime();
        if (globalStartTime.reverted) {
            log.error(
                'updateGlobalTimeStamp(): try_globalStartTime() on vesting v1 reverted in /setters/vestingBonus.ts',
                []
            );
        } else {
            md.global_start_time = globalStartTime.value.toI32();
        }
    } else if (vestingAddress == vesting2Address) {
        const contract = GROVestingV2.bind(Address.fromBytes(vestingAddress));
        const globalStartTime = contract.try_globalStartTime();
        if (globalStartTime.reverted) {
            log.error(
                'updateGlobalTimeStamp(): try_globalStartTime() on vesting v2 reverted in /setters/vestingBonus.ts',
                []
            );
        } else {
            md.global_start_time = globalStartTime.value.toI32();
        }
    } else {
        log.error(
            'updateGlobalTimeStamp(): vesting contract {} not found in /setters/vestingBonus.ts',
            [vestingAddress.toHexString()]
        );
    }
    if (save)
        md.save();
    return md;
}

// Events <LogExit> & <LogInstantExit> from GROVesting
export const updateExit = (
    userAddress: Bytes,
    vestingAddress: Bytes,
    vestingAmount: BigDecimal,      // amount
    totalLockedAmount: BigDecimal,  // totalLockedAmount
    penaltyAmount: BigDecimal,      // penalty
    isInstantExit: boolean,
): void => {
    let md = initMD();
    // Step 1: update total_bonus
    md = updateTotalBonus(
        md,
        penaltyAmount,
        false,
    );
    // Step 2: update total_locked_amount
    if (!isInstantExit && totalLockedAmount.ge(NUM.ZERO))
        md.total_locked_amount = totalLockedAmount;
    // Step 3: update global_start_time (Groove)
    md = updateGlobalTimeStamp(
        md,
        vestingAddress,
        false
    );
    // Step 4: update vesting_gro
    if (!isInstantExit) {
        let vestingBonus = initVestingBonus(userAddress, false);
        vestingBonus.vesting_gro = vestingBonus.vesting_gro
            .minus(vestingAmount);
        vestingBonus.save();
    }
    md.save();
}

export const updateInitUnlockedPercent = (
    amount: BigDecimal
): void => {
    let md = initMD();
    md.init_unlocked_percent = amount.div(BigDecimal.fromString('10000'));
    md.save();
}
