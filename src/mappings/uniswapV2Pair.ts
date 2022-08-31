import { Swap as SwapEvent } from '../../generated/UniswapV2Pair/UniswapV2Pair';
import {
    setGroPrice,
    setWethPrice,
} from '../setters/price';


export function handleSwap(event: SwapEvent): void {
    // Latest price for GRO & WETH is updated whenever there's a swap in the GRO/USDC pool
    // TODO: If triggering price from USDC/WETH pool, performance goes brrrrr, though... WETH price can significantly
    // change is short periods of time, so probably to be updated more often based on any other more frequent event
    setGroPrice();
    setWethPrice();
}
