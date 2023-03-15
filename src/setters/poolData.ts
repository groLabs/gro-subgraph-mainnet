// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Initialises entity <PoolData> and updates its reserves & total supply

import { NUM } from '../utils/constants';
import { PoolData } from '../../generated/schema';
import {
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <PoolData> with default values if not created yet
/// @param contractAddress the pool address
/// @param poolId the pool id
/// @return PoolData object for a given pool address and id
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

/// @notice Updates reserves & total supply in entity <PoolData>
/// @dev Triggered by the following contract events:
///         - <Swap> from Uniswap GVT/GRO Pool -> poolId: 1
///         - <Swap> from Uniswap GRO/USDC Pool -> poolId: 2
///         - <TokenExchange> from Curve Metapool 3CRVPWRD -> poolId: 4
///         - <TokenExchangeUnderlying> from Curve Metapool 3CRVPWRD -> poolId: 4
///         - <Transfer> from Balancer Pool and Chainlink (daily) -> poolId: 5
/// @param poolId the pool id (1,2,4,5)
/// @param contractAddress the pool address
/// @param reserve0 the pool reserve0 
/// @param reserve1 the pool reserve1
/// @param totalSupply the total pool supply
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
