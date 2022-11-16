
import { PoolSwap } from '../../generated/schema';
import { BigDecimal, Address } from '@graphprotocol/graph-ts';


export const setPoolSwap = (
    tx: string,
    poolId: i32,
    blockTimestamp: i32,
    blockNumber: i32,
    fromAddress: Address,
    amount0In: BigDecimal,
    amount1In: BigDecimal,
    amount0Out: BigDecimal,
    amount1Out: BigDecimal,
    toAddress: Address,
    virtualPrice: BigDecimal,
): void => {
    let swap = PoolSwap.load(tx);
    if (!swap) {
        swap = new PoolSwap(tx);
        swap.poolId = poolId;
        swap.block_timestamp = blockTimestamp;
        swap.block_number = blockNumber,
        swap.fromAddress = fromAddress;
        swap.amount0_in = amount0In;
        swap.amount0_out = amount1In;
        swap.amount1_in = amount0Out;
        swap.amount1_out = amount1Out;
        swap.toAddress = toAddress;
        swap.virtual_price = virtualPrice;
    }
    swap.save();
}
