import { Pool } from '../../generated/schema';
import { ZERO } from '../utils/constants';
import { Address} from '@graphprotocol/graph-ts';
import { getRewardDebt } from '../utils/staker';

export const setPools = (
    type: string,
    userAddress: string,
    poolId: i32,
    contractAddress: Address
): void => {
    const id = userAddress + '-' + poolId.toString();
    let pool = Pool.load(id);
    if (!pool) {
        pool = new Pool(id);
        pool.userAddress = userAddress;
        pool.poolId = poolId;
        pool.net_reward = ZERO;
        pool.reward_debt = ZERO;
        pool.balance = ZERO;
    }

    // Retrieve rewards debt from function userInfo() in staker contract
    // when there is any deposit, withdrawal or claim
    const currentRewardDebt = getRewardDebt(
        contractAddress,
        userAddress,
        poolId
    );

    // Reward = current reward from deposit/withdrawal/claim - last reward from deposit/withdrawal/claim
    const currentNetReward = currentRewardDebt.minus(pool.reward_debt);

    // If it's a claim, the reward is added to pool.net_reward for that pool
    if (type === 'claim' || type === 'multiclaim') {
        pool.net_reward = pool.net_reward.plus(currentNetReward);
    }
    pool.reward_debt = currentRewardDebt;
    pool.save();


}
