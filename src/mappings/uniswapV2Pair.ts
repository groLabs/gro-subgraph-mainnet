import { Swap as SwapEventGvtGro } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { Swap as SwapEventGroUsdc } from '../../generated/UniswapV2PairGroUsdc/UniswapV2Pair';
import { setPoolSwap } from '../setters/poolSwaps';
import { NUM, DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import {
    setWethPrice,
    setUniswapGvtGroPrice,
    setUniswapGroUsdcPrice,
} from '../setters/price';


export function handleSwapGvtGro(event: SwapEventGvtGro): void {
    // Latest price for GRO & WETH is updated whenever there's a swap in the GRO/USDC pool
    // TODO-1: If triggering price from USDC/WETH pool, performance goes brrrrr, though... WETH price can significantly
    // change is short periods of time, so probably to be updated more often based on any other more frequent event
    // TODO-2: add handlers for all GRO pools to capture latest reserves & totalSupply
    // setGroPrice(event.address);
    setUniswapGvtGroPrice();
    setWethPrice(); // to be moved
    setPoolSwap(
        event.block.timestamp.toString() + '-1',
        1,
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
        event.params.sender,
        tokenToDecimal(event.params.amount0In, 18, DECIMALS),
        tokenToDecimal(event.params.amount1In, 18, DECIMALS),
        tokenToDecimal(event.params.amount0Out, 18, DECIMALS),
        tokenToDecimal(event.params.amount1Out, 18, DECIMALS),
        event.params.to,
        NUM.ZERO,
    );
}

export function handleSwapGroUsdc(event: SwapEventGroUsdc): void {
    setUniswapGroUsdcPrice(); // This is updating GRO price
    setPoolSwap(
        event.block.timestamp.toString() + '-2',
        2,
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
        event.params.sender,
        tokenToDecimal(event.params.amount0In, 18, DECIMALS),
        tokenToDecimal(event.params.amount1In, 6, DECIMALS),
        tokenToDecimal(event.params.amount0Out, 18, DECIMALS),
        tokenToDecimal(event.params.amount1Out, 6, DECIMALS),
        event.params.to,
        NUM.ZERO,
    );
}
