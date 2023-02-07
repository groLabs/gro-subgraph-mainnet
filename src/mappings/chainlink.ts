import { handleBalancerSwap } from './balancerGroWeth';
import { updateFactors } from '../setters/factors';
import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import {
    set3CrvPrice,
    setGvtPrice
} from '../setters/price';

// contract blocks
const CURRENT_BLOCK = 15848232; //TODO

export function handleAnswerUpdated(event: AnswerUpdated): void {
    // update 3crv price
    set3CrvPrice();

    // update GVT & PWRD factor and price
    setGvtPrice();
    updateFactors();

    // store swap
    handleBalancerSwap(
        event.block.timestamp.toI32(),
        event.block.number.toI32(),
    );
}
