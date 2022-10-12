import { VestingBonus } from '../../generated/schema';
import { log, BigDecimal } from '@graphprotocol/graph-ts';
import { ZERO } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';

export const initVestingBonus = (
    userAddress: string,
    save: boolean,
): VestingBonus => {
    const id = userAddress;
    let vestingBonus = VestingBonus.load(id);
    if (!vestingBonus) {
        vestingBonus = new VestingBonus(id);
        vestingBonus.userAddress = userAddress;
        vestingBonus.locked_gro = ZERO;
        vestingBonus.net_reward = ZERO;
        vestingBonus.claim_now = ZERO;
        vestingBonus.vest_all = ZERO;
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
        : _amount.times(BigDecimal.fromString('0.3'));
    vestingBonus.net_reward = vestingBonus.net_reward.plus(amount);
    vestingBonus.save();
}

// GROVesting.totalBalance - GROVesting.vestedBalance OR GROVesting.vestingBalance
// export const updateLockedGro = () => {

// }

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