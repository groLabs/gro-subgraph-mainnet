// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Handles <AnswerUpdated> events from ChainlinkAggregator contract
///     - Since this event is triggered every hour, this is used to launch other processes
///       on a regular (daily) basis:
///         - Update three_crv & balancer_gro_weth prices
///         - Generate artificial Balancer swap
/// @dev
///     - ChainlinkAggregator: 0xdec0a100ead1faa37407f0edc76033426cf90b82

import { getTxData } from '../utils/tx';
import { handleBalancerSwap } from './balancerGroWeth';
import { AnswerUpdated } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import {
    set3CrvPrice,
    setBalancerGroWethPrice,
} from '../setters/price';


/// @notice Handles <AnswerUpdated> events from Chainlink aggregator contract
/// @param event the answer updated event
/// @dev:
///      - This contract is only used to trigger functions on a regular basis
///      - New Date(timestamp) returns incorrect dates, but works to get the midnight event
///      - Starting from G2 genesis block as it is used to update latest Balancer data
export function handleAnswerUpdated(event: AnswerUpdated): void {
    const currentBlockNumber = event.block.number.toI32();
    const currentBlockTimestamp = event.block.timestamp.toI32();
    const now = new Date(currentBlockTimestamp * 1000);
    if (now.getUTCHours() === 0) {
        // Updates three_crv price in entity <Price>
        set3CrvPrice();

        // Stores artificial Balancer swap to update the virtual price
        // only if current time is midnight
        handleBalancerSwap(
            currentBlockTimestamp,
            currentBlockNumber,
        );

        // Updates reserves & total supply in entity <PoolData>
        // and balancer_gro_weth price in entity <Price>
        setBalancerGroWethPrice(getTxData(event));
    }
}
