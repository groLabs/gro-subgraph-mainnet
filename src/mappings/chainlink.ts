import {
    set3CrvPrice,
    setBalancerGroWethPrice,
} from '../setters/price';
import { getTxData } from '../utils/tx';
import { handleBalancerSwap } from './balancerGroWeth';
import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';


// @dev:
//      - this function is triggered every hour
//      - new Date(timestamp) returns incorrect dates, but works to get the midnight event
//      - starting from G2 genesis block
export function handleAnswerUpdated(event: AnswerUpdated): void {
    const currentBlockNumber = event.block.number.toI32();
    // Execute statements only once a day - (midnight)
    const currentBlockTimestamp = event.block.timestamp.toI32();
    const now = new Date(currentBlockTimestamp * 1000);
    if (now.getUTCHours() === 0) {
        // update 3crv price
        set3CrvPrice();
        // store artificial Balancer swap to update the virtual price
        // only if current time is midnight
        handleBalancerSwap(
            currentBlockTimestamp,
            currentBlockNumber,
        );
        // update balancer_gro_weth price
        setBalancerGroWethPrice(getTxData(event));
    }
}
