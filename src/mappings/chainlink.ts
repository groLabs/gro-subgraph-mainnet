import { ADDR } from '../utils/constants';
import { setStableCoinPrice } from '../setters/price';
import { updateAllStrategies } from '../setters/strats';
import { handleBalancerSwap } from './balancerGroWeth';
import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';

const CURRENT_BLOCK = 15848232;

export function handleAnswerUpdated(event: AnswerUpdated): void {
    setStableCoinPrice(ADDR.CHAINLINK_DAI_USD);
    setStableCoinPrice(ADDR.CHAINLINK_USDC_USD);
    setStableCoinPrice(ADDR.CHAINLINK_USDT_USD);
    // minimize the subgraph synch time
    if (event.block.number.toI32() > CURRENT_BLOCK - 30000)
        updateAllStrategies(event.block.number);
    handleBalancerSwap(event.block.timestamp.toI32());
}
