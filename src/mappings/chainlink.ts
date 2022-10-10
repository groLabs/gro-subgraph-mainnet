import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import { setStableCoinPrice } from '../setters/price';
import {
    CHAINLINK_DAI_USD_ADDRESS,
    CHAINLINK_USDC_USD_ADDRESS,
    CHAINLINK_USDT_USD_ADDRESS,
} from '../utils/constants';


export function handleAnswerUpdated(event: AnswerUpdated): void {
    setStableCoinPrice(CHAINLINK_DAI_USD_ADDRESS);
    setStableCoinPrice(CHAINLINK_USDC_USD_ADDRESS);
    setStableCoinPrice(CHAINLINK_USDT_USD_ADDRESS);
}
