import { Pool } from '../../generated/schema';
import {
    BigInt, 
    Address, 
} from '@graphprotocol/graph-ts';
import { NUM } from '../utils/constants';
import { getRewardDebt } from '../utils/staker';
import { tokenToDecimal } from '../utils/tokens';


const initPool = (
    userAddress: string,
    poolId: i32,
): Pool => {
    const id = userAddress + '-' + poolId.toString();
    let pool = Pool.load(id);
    if (!pool) {
        pool = new Pool(id);
        pool.userAddress = userAddress;
        pool.poolId = poolId;
        pool.net_reward = NUM.ZERO;
        pool.reward_debt = NUM.ZERO;
        pool.balance = NUM.ZERO;
        pool.claim_now = NUM.ZERO;
        pool.vest_all = NUM.ZERO;
    }
    return pool;
}

export const setPools = (
    type: string,
    userAddress: string,
    poolId: i32,
    contractAddress: Address,
    coinAmount: BigInt,
): void => {
    let pool = initPool(userAddress, poolId);
    const amount = tokenToDecimal(coinAmount, 18, 7);

    // Retrieve rewards debt from function userInfo() in staker contract
    // when there is any deposit, withdrawal or claim
    const currentRewardDebt = getRewardDebt(
        contractAddress,
        userAddress,
        poolId
    );

    // Reward = current reward from deposit/withdrawal/claim - last reward from deposit/withdrawal/claim
    const currentNetReward = currentRewardDebt.minus(pool.reward_debt);

    if (type === 'claim' || type === 'multiclaim') {
        pool.net_reward = pool.net_reward.plus(currentNetReward);
    } else if (type === 'staker_deposit') {
        pool.balance = pool.balance.plus(amount);
    } else if (type === 'staker_withdrawal') {
        pool.balance = pool.balance.minus(amount);
    }

    pool.reward_debt = currentRewardDebt;
    pool.save();
}
