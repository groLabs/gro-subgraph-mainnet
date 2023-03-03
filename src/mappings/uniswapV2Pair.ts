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


export function handleSwapGvtGro(event: SwapEventGvtGro): void {
    const blockNumber = event.block.number.toI32();
    const blockTimestamp = event.block.timestamp.toI32();
    // TODO: block to be set to G2_START_BLOCK once there are token exchanges after that date
    if (blockNumber >= 16600000) {
        setUniswapGvtGroPrice();
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

export function handleSwapGroUsdc(event: SwapEventGroUsdc): void {
    const blockNumber = event.block.number.toI32();
    const blockTimestamp = event.block.timestamp.toI32();
    // TODO: block to be set to G2_START_BLOCK once there are token exchanges after that date
    if (blockNumber >= 16600000) {
        setUniswapGroUsdcPrice(); // This is updating GRO price
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

export function handleTransferGvtGro(event: TransferGvtGro): void {
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        'uniswap_gvt_gro',
    );
}

export function handleTransferGroUsdc(event: TransferGroUsdc): void {
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        'uniswap_gro_usdc',
    );
}
