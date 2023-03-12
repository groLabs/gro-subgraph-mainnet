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
///     - Handles <Transfer>, <TokenExchange> & <TokenExchangeUnderlying> events
///       from Curve Metapool contracts
/// @dev
//      - Essentially updates Curve Metapool's latest data (i.e.: reserves, total supply
//        & curve_pwrd3crv price), so we can start updating the related entities from G2
//        deployment instead of the pools creation to reduce indexing time
///     - Curve Metapool 3CRVPWRD: 0xbcb91e689114b9cc865ad7871845c95241df4105

import { contracts } from '../../addresses';
import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { setTotalSupply } from '../setters/coreData';
import { setCurvePwrd3crvPrice } from '../setters/price';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
    DECIMALS,
    TOKEN as Token,
    G2_START_BLOCK,
} from '../utils/constants';
import {
    Transfer,
    TokenExchange,
    TokenExchangeUnderlying,
    Vyper_contract as MetaPool
} from '../../generated/CurveMetapool3CRV/Vyper_contract';


/// @notice Handles <Transfer> events from Curve Metapool 3CRVPWRD contract
/// @param event the transfer event
export function handleTransfer(event: Transfer): void {
    // Updates total supply in entity <CoreData>
    setTotalSupply(
        event.params.sender,
        event.params.receiver,
        event.params.value,
        Token.CURVE_PWRD3CRV,
    );
}

/// @notice Handles <TokenExchange> events from Curve Metapool 3CRVPWRD contract
/// @param event the token exchange event
export function handleTokenExchange(event: TokenExchange): void {
    const blockNumber = event.block.number.toI32();
    const blockTimestamp = event.block.timestamp.toI32();
    if (blockNumber >= G2_START_BLOCK) {
        // Updates reserves & total supply in entity <PoolData>
        // and curve_pwrd3crv price in entity <Price>
        setCurvePwrd3crvPrice();

        // Stores swap in entity <PoolSwap>
        setPoolSwap(
            event.params.buyer.concatI32(blockTimestamp).concatI32(4),
            4,
            blockTimestamp,
            blockNumber,
            event.params.buyer,
            NUM.ZERO,
            tokenToDecimal(event.params.tokens_bought, 18, DECIMALS),
            NUM.ZERO,
            tokenToDecimal(event.params.tokens_sold, 18, DECIMALS),
            ADDR.ZERO,
            getVirtualPrice(),
        );
    }
}

/// @notice Handles <TokenExchangeUnderlying> events from Curve Metapool 3CRVPWRD contract
/// @param event the token exchange underlying event
export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlying): void {
    const blockNumber = event.block.number.toI32();
    const blockTimestamp = event.block.timestamp.toI32();
    if (blockNumber >= G2_START_BLOCK) {
        // Updates reserves & total supply in entity <PoolData>
        // and curve_pwrd3crv price in entity <Price>
        setCurvePwrd3crvPrice();

        // Stores swap in entity <PoolSwap>
        setPoolSwap(
            event.params.buyer.concatI32(blockTimestamp).concatI32(4),
            4,
            blockTimestamp,
            blockNumber,
            event.params.buyer,
            NUM.ZERO,
            tokenToDecimal(event.params.tokens_bought, 18, DECIMALS),
            NUM.ZERO,
            tokenToDecimal(event.params.tokens_sold, 18, DECIMALS),
            ADDR.ZERO,
            getVirtualPrice(),
        );
    }
}

/// @return virtual price from Curve Metapool 3CRVPWRD contract or 0 if call is reverted
const getVirtualPrice = (): BigDecimal => {
    const contractAddress = Address.fromString(contracts.CurveMetapool3CRVAddress);
    const contract = MetaPool.bind(contractAddress);
    const virtualPrice = contract.try_get_virtual_price();
    if (virtualPrice.reverted) {
        log.error(
            'getVirtualPrice(): try_get_virtual_price() reverted in /mappings/curveMetapool3CRV.ts'
            , []
        );
    } else {
        return tokenToDecimal(virtualPrice.value, 18, DECIMALS);
    }
    return NUM.ZERO;
}

