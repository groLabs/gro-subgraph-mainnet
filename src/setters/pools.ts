import { Pool } from '../../generated/schema';
import { getRewardDebt } from '../utils/staker';
import {
    NUM,
    TX_TYPE as TxType,
} from '../utils/constants';
import {
    Bytes,
    BigDecimal,
} from '@graphprotocol/graph-ts';


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

// @dev: Reward = current reward from deposit/withdrawal/claim - last reward from deposit/withdrawal/claim
export const setPools = (
    type: string,
    userAddress: Bytes,
    poolId: i32,
    contractAddress: Bytes,
    coinAmount: BigDecimal,
): void => {
    let pool = initPool(userAddress, poolId);
    // Retrieve rewards debt from function userInfo() in staker contract
    // when there is a deposit, withdrawal or claim
    const currentRewardDebt = getRewardDebt(
        contractAddress,
        userAddress,
        poolId
    );
    const currentNetReward = currentRewardDebt.minus(pool.reward_debt);
    if (type === TxType.CLAIM || type === TxType.MULTICLAIM) {
        pool.net_reward = pool.net_reward.plus(currentNetReward);
    } else if (type === TxType.STAKER_DEPOSIT) {
        pool.balance = pool.balance.plus(coinAmount);
    } else if (type === TxType.STAKER_WITHDRAWAL) {
        pool.balance = pool.balance.minus(coinAmount);
    }
    pool.reward_debt = currentRewardDebt;
    pool.save();
}
