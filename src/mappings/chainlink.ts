import { handleBalancerSwap } from './balancerGroWeth';
import { updateFactors } from '../setters/factors';
import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import {
    setGvtPrice,
    set3CrvPrice,
    setStableCoinPrice
} from '../setters/price';
import {
    chainlinkDaiUsdAddress,
    chainlinkUsdcUsdAddress,
    chainlinkUsdtUsdAddress,
} from '../utils/contracts';


export function handleAnswerUpdated(event: AnswerUpdated): void {
    // update stablecoin prices (used in Uniswap V2 price calculation)
    setStableCoinPrice(chainlinkDaiUsdAddress);
    setStableCoinPrice(chainlinkUsdcUsdAddress);
    setStableCoinPrice(chainlinkUsdtUsdAddress);

    // update 3crv price
    set3CrvPrice();

    // update GVT & PWRD factor and price
    setGvtPrice();
    updateFactors();

    // store articifical Balancer swap to update the price
    handleBalancerSwap(
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
    );
}
