
import { PoolData } from '../../generated/schema';
import { BigDecimal } from '@graphprotocol/graph-ts';
import { ZERO } from '../utils/constants';


const initPoolData = (
    contractAddress: string,
    poolId: i32
): PoolData => {
    let poolData = PoolData.load(contractAddress);
    if (!poolData) {
        poolData = new PoolData(contractAddress);
        poolData.poolId = poolId;
        poolData.reserve0 = ZERO;
        poolData.reserve1 = ZERO;
        poolData.total_supply = ZERO;
    }
    return poolData;
}

export const updatePoolData = (
    poolId: i32,
    contractAddress: string,
    reserve0: BigDecimal,
    reserve1: BigDecimal,
    totalSupply: BigDecimal,
): void => {
    const dataPool = initPoolData(contractAddress, poolId);
    dataPool.reserve0 = reserve0;
    dataPool.reserve1 = reserve1;
    dataPool.total_supply = totalSupply;
    dataPool.save();
}
