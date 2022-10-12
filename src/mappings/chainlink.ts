import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import { setStableCoinPrice } from '../setters/price';
import { ADDR } from '../utils/constants';


export function handleAnswerUpdated(event: AnswerUpdated): void {
    setStableCoinPrice(ADDR.CHAINLINK_DAI_USD);
    setStableCoinPrice(ADDR.CHAINLINK_USDC_USD);
    setStableCoinPrice(ADDR.CHAINLINK_USDT_USD);
}
