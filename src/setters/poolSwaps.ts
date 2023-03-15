// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Stores swaps from any of the Gro pools (Uniswap, Balancer & Curve Metapool)
///         in entity <PoolSwap>

import { PoolSwap } from '../../generated/schema';
import {
    Bytes,
    BigDecimal
} from '@graphprotocol/graph-ts';


/// @notice Stores pool swaps in entity <PoolSwap>
/// @dev Triggered by the following contract events:
///         - <Swap> from Uniswap Gvt/Gro Pool & Uniswap Gro/Usdc Pool
///         - <TokenExchange> & <TokenExchangeUnderlying> from Curve Metapool 
///         - Chainlink regular events for Balancer Gro/Weth Pool
/// @param id the PoolSwap id (fromAddress + blockTimestamp + poolId in bytes)
/// @param poolId the pool id
/// @param blockTimestamp the block timestamp of the tx swap
/// @param blockNumber the block number of the tx swap
/// @param fromAddress the from address
/// @param amount0In the swapped amount 0 in (only for Uniswap)
/// @param amount1In the swapped amount 1 in (only for Uniswap & Curve)
/// @param amount0Out the swapped amount 0 out (only for Uniswap)
/// @param amount1Out the swapped amount 1 out (only for Uniswap & Curve)
/// @param toAddress the to address
/// @param virtualPrice the virtual price (only for Balancer & Curve)
export const setPoolSwap = (
    id: Bytes,
    poolId: i32,
    blockTimestamp: i32,
    blockNumber: i32,
    fromAddress: Bytes,
    amount0In: BigDecimal,
    amount1In: BigDecimal,
    amount0Out: BigDecimal,
    amount1Out: BigDecimal,
    toAddress: Bytes,
    virtualPrice: BigDecimal,
): void => {
    let swap = PoolSwap.load(id);
    if (!swap) {
        swap = new PoolSwap(id);
        swap.pool_id = poolId;
        swap.block_timestamp = blockTimestamp;
        swap.block_number = blockNumber,
        swap.from_address = fromAddress;
        swap.amount0_in = amount0In;
        swap.amount0_out = amount1In;
        swap.amount1_in = amount0Out;
        swap.amount1_out = amount1Out;
        swap.to_address = toAddress;
        swap.virtual_price = virtualPrice;
    }
    swap.save();
}
