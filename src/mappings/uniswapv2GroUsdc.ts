import { Swap as SwapEvent } from '../../generated/UniswapV2GroUsdc/UniswapV2GroUsdc';
import { setGroPrice } from '../setters/price';


export function handleSwap(event: SwapEvent): void {
    setGroPrice();
}
