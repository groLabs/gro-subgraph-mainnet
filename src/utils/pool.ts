import { PoolData } from '../../generated/schema';
import { UniswapV2Pair } from '../../generated/UniswapV2Pair/UniswapV2Pair';
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

//TODO: move to utils->pool
export const getUniV2Price = (poolAddress: Address): BigDecimal => {
    const contract = UniswapV2Pair.bind(poolAddress);
    const reserves = contract.try_getReserves();
    const totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_getReserves', []);
        return ZERO;
    } else if (totalSupply.reverted) {
        log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_totalSupply', []);
        return ZERO;
    } else {
        if (poolAddress == UNISWAPV2_GRO_USDC_ADDRESS) {
            const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
            const gvt_reserve = tokenToDecimal(reserves.value.get_reserve0(), 18, 7);
            const usdc_reserve = tokenToDecimal(reserves.value.get_reserve1(), 6, 7);
            // update Pool data
            updatePoolData(
                2,
                UNISWAPV2_GRO_USDC_ADDRESS.toHexString(),
                usdc_reserve,
                gvt_reserve,
                total_supply,
            );
            // return GRO price per share
            // TODO: chainlink to calc the USD price of USDC.
            const pps = usdc_reserve.div(gvt_reserve).truncate(DECIMALS);
            return pps;
        } else if (poolAddress == UNISWAPV2_USDC_WETH_ADDRESS) {
            const usdc_reserve = tokenToDecimal(reserves.value.get_reserve0(), 6, 7);
            const weth_reserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);
            // return WETH price per share
            // TODO: chainlink to calc the USD price of USDC
            const pps = usdc_reserve.div(weth_reserve).truncate(DECIMALS);
            return pps;
        } else {
            return ZERO;
        }
    }
}