import { Pool } from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export const setPools = (
    type: string,
    userAddress: string,
    // vest: bool,
    poolId: i32,
    amount: BigInt,
): void => {
    const id = userAddress + '-' + poolId.toString();

    let pool = Pool.load(id);

    if (!pool) {
        pool = new Pool(id);
        pool.userAddress = userAddress;
        pool.poolId = poolId;
        pool.net_reward = BigDecimal.fromString('0');
        pool.balance = BigDecimal.fromString('0');
    }

    const parsedAmount = tokenToDecimal(amount, 18, 7);

    if (type === 'claim') {
        pool.net_reward = pool.net_reward.plus(parsedAmount);
    } else if (type === 'multiclaim') {
        // TODO: we should retrieve the claimable amount per pool in block - 1. Alternatives?
        pool.net_reward = pool.net_reward.plus(parsedAmount);
    }

    pool.save();
}
