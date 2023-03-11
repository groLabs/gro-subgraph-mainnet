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
///     - Handles <Transfer> events from Balancer Pool contract
///     - Generates a daily swap to store virtual price
/// @dev
///     - Balancer Vault: 0xba12222222228d8ba445958a75a0704d566bf2c8
///     - Balancer Pool: 0x702605f43471183158938c1a3e5f5a359d7b31ba

import { getTxData } from '../utils/tx';
import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { setTotalSupply } from '../setters/coreData';
import { balGroWethPoolAddress } from '../utils/contracts';
import { setBalancerGroWethPrice } from '../setters/price';
import { Transfer } from '../../generated/BalancerGroWethPool/ERC20';
import { AuthorizerChanged } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import {
    log,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
    DECIMALS,
    TOKEN as Token,
} from '../utils/constants';


/// @dev This Balancer Vault contract is only used to do calls, but a handler
///      is still needed to enable reading from it
export function handleAuthorizerChanged(event: AuthorizerChanged): void {
    // do nothing ;)
}

/// @notice Handles <Transfer> events from Balancer Pool contract
/// @param event the transfer event
export function handleTransfer(event: Transfer): void {
    // Updates reserves & total supply in entity <PoolData>
    // and balancer_gro_weth price in entity <Price>
    setBalancerGroWethPrice(getTxData(event));

    // Updates total supply in entity <CoreData>
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        Token.BALANCER_GRO_WETH,
    );
}

/// @notice Handles swaps in Balancer Vault
/// @param _now the current block timestamp
/// @param _now the current block number
/// @dev 
///     - The Balancer Vault handles plenty of other tokens, so listening to swap events
///       would kill subgraph performance. Alternatively, 'artificial swaps' are created
///       by listening regular Chainlink events and storing a swap only once in a day (midnight)
///     - Since no real swaps are captured, the price is established by calling Balancer
///       Vault's getRate() function
export function handleBalancerSwap(
    _now: i32,
    blockNumber: i32,
): void {
    const now = new Date(_now * 1000);
    if (now.getUTCHours() === 0) {
        // Stores swap in entity <PoolSwap> only at midnight
        setPoolSwap(
            ADDR.ZERO.concatI32(_now).concatI32(5),
            5,
            _now,
            blockNumber,
            ADDR.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            ADDR.ZERO,
            getVirtualPrice(),
        );
    }
}

/// @return virtual price from Balancer Vault contract or 0 if call is reverted
const getVirtualPrice = (): BigDecimal => {
    const contract = BalancerPool.bind(balGroWethPoolAddress);
    const virtualPrice = contract.try_getRate();
    if (virtualPrice.reverted) {
        log.error('getVirtualPrice(): try_getRate() reverted in /mappings/balancerGroWeth.ts', []);
    } else {
        return tokenToDecimal(virtualPrice.value, 18, DECIMALS);
    }
    return NUM.ZERO;
}
