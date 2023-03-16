// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Initialises entity <Pool> and updates its net reward, balance and debt

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


/// @notice Initialises entity <Pool> with default values if not created yet
/// @param userAddress the user address
/// @param poolId the pool id
/// @return Pool object for a given user address and pool id
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
    }
    return pool;
}

/// @notice Updates net reward, balance and debt in entity <Pool> when there
///         is a deposit, withdrawal or claim from the Staker contract
/// @dev - Triggered by the following Staker events:
///         - <LogClaim>
///         - <LogMultiClaim>
///         - <LogDeposit>
///         - <LogWithdraw>
///         - <LogEmergencyWithdraw>
///      - Reward is calculated as the current reward from deposit/withdrawal/claim
///        minus the last reward from deposit/withdrawal/claim
/// @param type the transaction type (staker_deposit, staker_withdrawal, claim, multiclaim)
/// @param userAddress the user address
/// @param poolId the pool id
/// @param stakerContract the staker contract (v1, v2)
/// @param coinAmount the coin amount
export function setPools<T> (
    type: string,
    userAddress: Bytes,
    poolId: i32,
    stakerContract: T,
    coinAmount: BigDecimal,
): void {
    let pool = initPool(userAddress, poolId);
    const currentRewardDebt = getRewardDebt(
        stakerContract,
        userAddress,
        poolId,
    );
    const currentNetReward = currentRewardDebt.minus(pool.reward_debt);
    if (
        type === TxType.CLAIM
        || type === TxType.MULTICLAIM
    ) {
        pool.net_reward = pool.net_reward.plus(currentNetReward);
    } else if (type === TxType.STAKER_DEPOSIT) {
        pool.balance = pool.balance.plus(coinAmount);
    } else if (type === TxType.STAKER_WITHDRAWAL) {
        pool.balance = pool.balance.minus(coinAmount);
    }
    pool.reward_debt = currentRewardDebt;
    pool.save();
}
