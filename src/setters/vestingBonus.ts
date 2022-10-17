import {
    VestingBonus,
} from '../../generated/schema';
import {
    log,
    Address,
    BigDecimal,
    BigInt
} from '@graphprotocol/graph-ts';
import { tokenToDecimal } from '../utils/tokens';
import { initTotals } from './totals';
import {
    NUM,
    ADDR,
} from '../utils/constants';
import { setMasterData } from './masterdata';
import { GROVesting as GROVestingV1 } from '../../generated/GROVestingV1/GROVesting';
import { GROVesting as GROVestingV2 } from '../../generated/GROVestingV2/GROVesting';


export const initVestingBonus = (
    userAddress: string,
    save: boolean,
): VestingBonus => {
    const id = userAddress;
    let vestingBonus = VestingBonus.load(id);
    if (!vestingBonus) {
        vestingBonus = new VestingBonus(id);
        vestingBonus.userAddress = userAddress;
        vestingBonus.locked_gro = NUM.ZERO;
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

export const updateNetReward = (
    userAddress: string,
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

export const updateVest = (
    userAddress: string,
    amount: BigDecimal,
    latestStartTime: BigInt,
): void => {
    const vestingBonus = initVestingBonus(userAddress, false);
    vestingBonus.vesting_gro = vestingBonus.vesting_gro.plus(amount);
    vestingBonus.latest_start_time = latestStartTime.toI32();
    vestingBonus.save();
}

export const updateExit = (
    userAddress: string,
    amount: BigDecimal
): void => {
    const vestingBonus = initVestingBonus(userAddress, false);
    vestingBonus.vesting_gro = vestingBonus.vesting_gro.minus(amount);
    vestingBonus.save();
}

export const updateTotalGroove = (
    totalLockedAmount: BigDecimal,
    vestingAddress: Address,
): void => {
    let md = setMasterData();
    if (totalLockedAmount.ge(NUM.ZERO))
        md.total_locked_amount = totalLockedAmount;
    if (vestingAddress == ADDR.GRO_VESTING_V1) {
        const contract = GROVestingV1.bind(vestingAddress);
        const globalStartTime = contract.try_globalStartTime();
        if (globalStartTime.reverted) {
            log.error('TBC***********', []);
        } else {
            md.global_start_time = globalStartTime.value.toI32();
        }
    } else if (vestingAddress == ADDR.GRO_VESTING_V2) {
        const contract = GROVestingV2.bind(vestingAddress);
        const globalStartTime = contract.try_globalStartTime();
        if (globalStartTime.reverted) {
            log.error('TBC***********', []);
        } else {
            md.global_start_time = globalStartTime.value.toI32();
        }
    } else {
        log.error('TBC***********', []);
    }
    md.save();
}

export const updateTotalBonus = (
    amount: BigDecimal
): void => {
    let md = setMasterData();
    md.total_bonus = md.total_bonus.plus(amount);
    md.save();
}