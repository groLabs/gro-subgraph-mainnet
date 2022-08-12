import { Swap as SwapEvent } from '../../generated/UniswapV2UsdcWeth/UniswapV2UsdcWeth';
import { setWethPrice } from '../setters/price';


export function handleSwap(event: SwapEvent): void {
    setWethPrice()
}
