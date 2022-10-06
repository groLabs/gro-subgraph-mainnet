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
    ONE,
    ZERO,
    DECIMALS,
    CURVE_PWRD_3CRV_ADDRESS,
    UNISWAPV2_GVT_GRO_ADDRESS,
    UNISWAPV2_GRO_USDC_ADDRESS,
    UNISWAPV2_USDC_WETH_ADDRESS,
} from '../utils/constants';
import { tokenToDecimal } from './tokens';
import { updatePoolData } from '../setters/poolData';




export const getUniV2Price = (
    poolAddress: Address,
    update: boolean,
): BigDecimal => {
    // if (poolAddress == UNISWAPV2_GVT_GRO_ADDRESS) {
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
    if (poolAddress == UNISWAPV2_GRO_USDC_ADDRESS) {
        const contract = UniswapV2PairGroUsdc.bind(poolAddress);
        const reserves = contract.try_getReserves();
        const totalSupply = contract.try_totalSupply();
        if (reserves.reverted) {
            log.error('getUniV2Price() reverted in src/utils/pools.ts -> try_getReserves on GroUsdc pool', []);
            return ZERO;
        } else if (totalSupply.reverted) {
            log.error('getUniV2Price() reverted in src/utils/pools.ts -> try_totalSupply on GroUsdc pool', []);
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

// export const getCurvePwrd3crvPrice = (
//     update: boolean
// ): BigDecimal => {
//     const contract = CurveMetapool3CRV.bind(CURVE_PWRD_3CRV_ADDRESS);
//     const reserves = contract.try_get_balances();
//     const totalSupply = contract.try_totalSupply();
//     const virtualPrice = contract.try_get_virtual_price();
//     if (reserves.reverted) {
//         log.error('getCurvePwrd3crvPrice() reverted in src/utils/pools.ts -> try_get_balances on Curve3Crv pool', []);
//         return ZERO;
//     } else if (totalSupply.reverted) {
//         log.error('getCurvePwrd3crvPrice() reverted in src/utils/pools.ts -> try_totalSupply on Curve3Crv pool', []);
//         return ZERO;
//     } else if (virtualPrice.reverted) {
//         log.error('getCurvePwrd3crvPrice() reverted in src/utils/pools.ts -> try_get_virtual_price on Curve3Crv pool', []);
//         return ZERO;
//     } else {
//         const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
//         const crv_reserve = tokenToDecimal(reserves.value[0], 18, 7);
//         const pwrd_reserve = tokenToDecimal(reserves.value[1], 18, 7);
//         // update Pool data
//         if (update)
//             updatePoolData(
//                 4,
//                 CURVE_PWRD_3CRV_ADDRESS.toHexString(),
//                 crv_reserve,
//                 pwrd_reserve,
//                 total_supply,
//             );
//     }
//     return tokenToDecimal(virtualPrice.value, 18, 7);
// }


// log.error(
//     'oneGvt {} oneGro {} oneGvtValue {} oneGroValue {} oneLpValue {}', [
//     oneGvt.toString(),
//     oneGro.toString(),
//     oneGvtValue.toString(),
//     oneGroValue.toString(),
//     oneLpValue.toString(),
// ]);