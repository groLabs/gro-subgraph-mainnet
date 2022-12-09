import { ADDR } from '../utils/constants';
import { 
    setStableCoinPrice, 
    set3CrvPrice,
    setGvtPrice
} from '../setters/price';
import { updateAllStrategies } from '../setters/strats';
import { updateGTokenFactor } from "../setters/factors";
import { handleBalancerSwap } from './balancerGroWeth';
import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';

const CURRENT_BLOCK = 15848232;

export function handleAnswerUpdated(event: AnswerUpdated): void {
    setStableCoinPrice(ADDR.CHAINLINK_DAI_USD);
    setStableCoinPrice(ADDR.CHAINLINK_USDC_USD);
    setStableCoinPrice(ADDR.CHAINLINK_USDT_USD);

    // update 3crv price
    set3CrvPrice();
    

    // update GVT & PWRD factor and price
    setGvtPrice();
    updateGTokenFactor(event.block.number.toI32());

    // minimize the subgraph synch time
    if (event.block.number.toI32() > CURRENT_BLOCK - 30000)
        updateAllStrategies(event.block.number);
    handleBalancerSwap(
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
        );
}
