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
///     - Handles <Swap> & <Transfer> events from Uniswap V2 Gvt/Gro pool contract
///     - Handles <Swap> & <Transfer> events from Uniswap V2 Gro/Usdc pool contract
/// @dev
///     - Uniswap V2 Gvt/Gro: 0x2ac5bc9dda37601edb1a5e29699deb0a5b67e9bb
///     - Uniswap V2 Gro/Usdc: 0x21c5918ccb42d20a2368bdca8feda0399ebfd2f6

import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { setTotalSupply } from '../setters/coreData';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    setUniswapGvtGroPrice,
    setUniswapGroUsdcPrice,
} from '../setters/price';
import {
    Swap as SwapEventGvtGro,
    Transfer as TransferGvtGro,
} from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import {
    Swap as SwapEventGroUsdc,
    Transfer as TransferGroUsdc,
} from '../../generated/UniswapV2PairGroUsdc/UniswapV2Pair';


/// @notice Handles <Swap> events from Uniswap V2 GVT/GRO pool contract
/// @param event the swap event
export function handleSwapGvtGro(event: SwapEventGvtGro): void {
    const blockNumber = event.block.number.toI32();
    const blockTimestamp = event.block.timestamp.toI32();
    // TODO: block to be set to G2_START_BLOCK once there are token exchanges after that date
    if (blockNumber >= 16600000) {
        // Updates reserves & total supply in entity <PoolData>
        // and uniswap_gvt_gro price in entity <Price>
        setUniswapGvtGroPrice();

        // Stores swap in entity <PoolSwap>
        setPoolSwap(
            event.params.sender.concatI32(blockTimestamp).concatI32(1),
            1,
            blockTimestamp,
            blockNumber,
            event.params.sender,
            tokenToDecimal(event.params.amount0In, 18, DECIMALS),
            tokenToDecimal(event.params.amount1In, 18, DECIMALS),
            tokenToDecimal(event.params.amount0Out, 18, DECIMALS),
            tokenToDecimal(event.params.amount1Out, 18, DECIMALS),
            event.params.to,
            NUM.ZERO,
        );
    }
}

/// @notice Handles <Swap> events from Uniswap V2 GRO/USDC pool contract
/// @param event the swap event
export function handleSwapGroUsdc(event: SwapEventGroUsdc): void {
    const blockNumber = event.block.number.toI32();
    const blockTimestamp = event.block.timestamp.toI32();
    // TODO: block to be set to G2_START_BLOCK once there are token exchanges after that date
    if (blockNumber >= 16600000) {
        // Updates reserves & total supply in entity <PoolData>
        // and uniswap_gro_usdc AND gro prices in entity <Price>
        setUniswapGroUsdcPrice();

        // Stores swap in entity <PoolSwap>
        setPoolSwap(
            event.params.sender.concatI32(blockTimestamp).concatI32(2),
            2,
            blockTimestamp,
            blockNumber,
            event.params.sender,
            tokenToDecimal(event.params.amount0In, 18, DECIMALS),
            tokenToDecimal(event.params.amount1In, 6, DECIMALS),
            tokenToDecimal(event.params.amount0Out, 18, DECIMALS),
            tokenToDecimal(event.params.amount1Out, 6, DECIMALS),
            event.params.to,
            NUM.ZERO,
        );
    }
}

/// @notice Handles <Transfer> events from Uniswap V2 GVT/GRO pool contract
/// @param event the transfer event
export function handleTransferGvtGro(event: TransferGvtGro): void {
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        'uniswap_gvt_gro',
    );
}

/// @notice Handles <Transfer> events from Uniswap V2 GRO/USDC pool contract
/// @param event the transfer event
export function handleTransferGroUsdc(event: TransferGroUsdc): void {
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        'uniswap_gro_usdc',
    );
}
