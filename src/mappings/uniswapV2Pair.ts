import { Swap as SwapEventGvtGro } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { Swap as SwapEventGroUsdc } from '../../generated/UniswapV2PairGroUsdc/UniswapV2Pair';
// import { Swap as SwapEvent } from '../../generated/UniswapV2Pair/UniswapV2Pair';
import {
    setGroPrice,
    setWethPrice,
} from '../setters/price';


export function handleSwapGvtGro(event: SwapEventGvtGro): void {
    // Latest price for GRO & WETH is updated whenever there's a swap in the GRO/USDC pool
    // TODO-1: If triggering price from USDC/WETH pool, performance goes brrrrr, though... WETH price can significantly
    // change is short periods of time, so probably to be updated more often based on any other more frequent event
    // TODO-2: add handlers for all GRO pools to capture latest reserves & totalSupply
    setGroPrice(event.address);
    setWethPrice(); // to be moved
}

export function handleSwapGroUsdc(event: SwapEventGroUsdc): void {
    setGroPrice(event.address);
}
