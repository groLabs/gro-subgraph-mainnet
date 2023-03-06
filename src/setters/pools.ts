import { Pool } from '../../generated/schema';
import { getRewardDebt } from '../utils/staker';
import { tokenToDecimal } from '../utils/tokens';
import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';


const initPool = (
    userAddress: Bytes,
    poolId: i32,
): Pool => {
    const id = userAddress.concatI32(poolId);
    let pool = Pool.load(id);
    if (!pool) {
        pool = new Pool(id);
        pool.user_address = userAddress;
        pool.pool_id = poolId;
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
    userAddress: Bytes,
    poolId: i32,
    contractAddress: Bytes,
    coinAmount: BigInt,
): void => {
    let pool = initPool(userAddress, poolId);
    const amount = tokenToDecimal(coinAmount, 18, DECIMALS);
    // Retrieve rewards debt from function userInfo() in staker contract
    // when there is a deposit, withdrawal or claim
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
