import { PoolData } from '../../generated/schema';
// import { UniswapV2Pair } from '../../generated/UniswapV2Pair/UniswapV2Pair';
import { UniswapV2Pair as UniswapV2PairGvtGro } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { UniswapV2Pair as UniswapV2PairGroUsdc } from '../../generated/UniswapV2PairGroUsdc/UniswapV2Pair';
import { Vyper_contract as CurveMetapool3CRV } from '../../generated/CurveMetapool3CRV/Vyper_contract';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import { tokenToDecimal } from './tokens';
import { updatePoolData } from '../setters/poolData';




export const getUniV2Price = (
    poolAddress: Address,
    update: boolean,
): BigDecimal => {
    // if (poolAddress == ADDR.UNISWAPV2_GVT_GRO) {
    //     const contract = UniswapV2PairGvtGro.bind(poolAddress);
    //     const reserves = contract.try_getReserves();
    //     const totalSupply = contract.try_totalSupply();
    //     if (reserves.reverted) {
    //         log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_getReserves on GvtGro pool', []);
    //         return ZERO;
    //     } else if (totalSupply.reverted) {
    //         log.error('getUniV2Price() reverted in src/utils/tokens.ts -> try_totalSupply  on GvtGro pool', []);
    //         return ZERO;
    //     } else {
    //         const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
    //         const gvt_reserve = tokenToDecimal(reserves.value.get_reserve0(), 18, 7);
    //         const gro_reserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);

    //         // update Pool data
    //         if (update) {
    //             updatePoolData(
    //                 1,
    //                 poolAddress.toHexString(),
    //                 gvt_reserve,
    //                 gro_reserve,
    //                 total_supply,
    //             );
    //         }

    //         const price = initPrice();
    //         const oneGvt = (ONE.div(total_supply)).times(gvt_reserve);
    //         const oneGro = (ONE.div(total_supply)).times(gro_reserve);
    //         const oneGvtValue = oneGvt.times(price.gvt);
    //         const oneGroValue = oneGro.times(price.gro);
    //         const oneLpValue = oneGvtValue.plus(oneGroValue);
    //         price.uniswap_gvt_gro = oneLpValue;
    //         price.save();

    //         return oneLpValue;
    //         // return ZERO;
    //     }
    // } else 
    if (poolAddress == ADDR.UNISWAPV2_GRO_USDC) {
        const contract = UniswapV2PairGroUsdc.bind(poolAddress);
        const reserves = contract.try_getReserves();
        const totalSupply = contract.try_totalSupply();
        if (reserves.reverted) {
            log.error('getUniV2Price() reverted in src/utils/pools.ts -> try_getReserves on GroUsdc pool', []);
            return NUM.ZERO;
        } else if (totalSupply.reverted) {
            log.error('getUniV2Price() reverted in src/utils/pools.ts -> try_totalSupply on GroUsdc pool', []);
            return NUM.ZERO;
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
    } else if (poolAddress == ADDR.UNISWAPV2_USDC_WETH) {
        // const contract = UniswapV2Pair.bind(poolAddress);
        // const reserves = contract.try_getReserves();
        // const totalSupply = contract.try_totalSupply();
        // const usdc_reserve = tokenToDecimal(reserves.value.get_reserve0(), 6, 7);
        // const weth_reserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);
        // // return WETH price per share
        // // TODO: chainlink to calc the USD price of USDC
        // const pps = usdc_reserve.div(weth_reserve).truncate(DECIMALS);
        // return pps;
        return NUM.ZERO;
    } else {
        // TODO: log
        return NUM.ZERO;
    }
    // }
}
