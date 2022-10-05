import { PoolData } from '../../generated/schema';
// import { UniswapV2Pair } from '../../generated/UniswapV2Pair/UniswapV2Pair';
import { UniswapV2Pair as UniswapV2PairGvtGro } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { UniswapV2Pair as UniswapV2PairGroUsdc } from '../../generated/UniswapV2PairGroUsdc/UniswapV2Pair';
import {
    log,
    Address,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    ZERO,
    ONE,
    DECIMALS,
    GVT_ADDRESS,
    PWRD_ADDRESS,
    UNISWAPV2_GVT_GRO_ADDRESS,
    UNISWAPV2_GRO_USDC_ADDRESS,
    UNISWAPV2_USDC_WETH_ADDRESS,
} from '../utils/constants';
import { tokenToDecimal } from './tokens';


const initPoolData = (
    contractAddress: string,
    poolId: i32
): PoolData => {
    let poolData = PoolData.load(contractAddress);
    if (!poolData) {
        poolData = new PoolData(contractAddress);
        poolData.poolId = poolId;
        poolData.reserve0 = ZERO;
        poolData.reserve1 = ZERO;
        poolData.total_supply = ZERO;
    }
    return poolData;
}

export const updatePoolData = (
    poolId: i32,
    contractAddress: string,
    reserve0: BigDecimal,
    reserve1: BigDecimal,
    totalSupply: BigDecimal,
): void => {
    const dataPool = initPoolData(contractAddress, poolId);
    dataPool.reserve0 = reserve0;
    dataPool.reserve1 = reserve1;
    dataPool.total_supply = totalSupply;
    dataPool.save();
}

export const getUniV2Price = (
    poolAddress: Address,
    update: boolean,
): BigDecimal => {
    if (poolAddress == UNISWAPV2_GVT_GRO_ADDRESS) {
        const contract = UniswapV2PairGvtGro.bind(poolAddress);
        const reserves = contract.try_getReserves();
        const totalSupply = contract.try_totalSupply();
        if (reserves.reverted) {
            log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_getReserves on GvtGro pool', []);
            return ZERO;
        } else if (totalSupply.reverted) {
            log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_totalSupply  on GvtGro pool', []);
            return ZERO;
        } else {
            // update Pool data
            if (update) {
                const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
                const gvt_reserve = tokenToDecimal(reserves.value.get_reserve0(), 18, 7);
                const gro_reserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);
                updatePoolData(
                    1,
                    poolAddress.toHexString(),
                    gvt_reserve,
                    gro_reserve,
                    total_supply,
                );
            }

            return ZERO;
        }
    } else if (poolAddress == UNISWAPV2_GRO_USDC_ADDRESS) {
        const contract = UniswapV2PairGroUsdc.bind(poolAddress);
        const reserves = contract.try_getReserves();
        const totalSupply = contract.try_totalSupply();
        if (reserves.reverted) {
            log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_getReserves on GroUsdc pool', []);
            return ZERO;
        } else if (totalSupply.reverted) {
            log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_totalSupply on GroUsdc pool', []);
            return ZERO;
        } else {
            const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
            const gro_reserve = tokenToDecimal(reserves.value.get_reserve0(), 18, 7);
            const usdc_reserve = tokenToDecimal(reserves.value.get_reserve1(), 6, 7);
            // update Pool data
            if (update)
                updatePoolData(
                    2,
                    poolAddress.toHexString(),
                    gro_reserve,
                    usdc_reserve,
                    total_supply,
                );
            // return GRO price per share
            // TODO: chainlink to calc the USD price of USDC.
            const pps = usdc_reserve.div(gro_reserve).truncate(DECIMALS);
            return pps;
        }

    } else if (poolAddress == UNISWAPV2_USDC_WETH_ADDRESS) {
        // const contract = UniswapV2Pair.bind(poolAddress);
        // const reserves = contract.try_getReserves();
        // const totalSupply = contract.try_totalSupply();
        // const usdc_reserve = tokenToDecimal(reserves.value.get_reserve0(), 6, 7);
        // const weth_reserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);
        // // return WETH price per share
        // // TODO: chainlink to calc the USD price of USDC
        // const pps = usdc_reserve.div(weth_reserve).truncate(DECIMALS);
        // return pps;
        return ZERO;
    } else {
        // TODO: log
        return ZERO;
    }
    // }
}
