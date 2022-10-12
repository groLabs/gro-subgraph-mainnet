import { VestingBonus } from '../../generated/schema';
import { log, BigDecimal } from '@graphprotocol/graph-ts';
import { tokenToDecimal } from '../utils/tokens';
import { initTotals } from './totals';
import { NUM } from '../utils/constants';

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

// GROVesting.totalBalance - GROVesting.vestedBalance OR GROVesting.vestingBalance
export const updateCombinedGro = (
    userAddress: string,
    amount: BigDecimal
): void => {
    const totals = initTotals(userAddress, false);
    totals.gro_balance_combined = totals.gro_balance_combined.plus(amount);
    totals.save();
}

/*
    "vest_bonus": {
        "locked_gro": "1904.23",
        "net_reward": "2546.89",
        "rewards": {
            "claim_now": "34.00",
            "vest_all": "113.33"
        }
    },
*/