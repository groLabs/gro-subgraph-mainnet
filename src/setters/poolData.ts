import { NUM } from '../utils/constants';
import { PoolData } from '../../generated/schema';
import {
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


const initPoolData = (
    contractAddress: Address,
    poolId: i32
): PoolData => {
    const id = poolId.toString();
    let poolData = PoolData.load(id);
    if (!poolData) {
        poolData = new PoolData(id);
        poolData.pool_address = contractAddress;
        poolData.reserve0 = NUM.ZERO;
        poolData.reserve1 = NUM.ZERO;
        poolData.total_supply = NUM.ZERO;
    }
    return poolData;
}

export const updatePoolData = (
    poolId: i32,
    contractAddress: Address,
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
