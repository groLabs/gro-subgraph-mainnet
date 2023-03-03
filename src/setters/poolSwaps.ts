import { PoolSwap } from '../../generated/schema';
import {
    Bytes,
    BigDecimal
} from '@graphprotocol/graph-ts';


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
