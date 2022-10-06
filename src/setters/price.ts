import { Price } from '../../generated/schema';
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
import { updatePoolData } from './poolData';
import { getUniV2Price } from '../utils/pool';
import { getPricePerShare, tokenToDecimal } from '../utils/tokens';
import { UniswapV2Pair as UniswapV2PairGvtGro } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { Vyper_contract as CurveMetapool3CRV } from '../../generated/CurveMetapool3CRV/Vyper_contract';



// export function initPrice(): Price {
export const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = ONE;
        price.gvt = ZERO;
        price.gro = ZERO;
        price.weth = ZERO;
        price.balancer_gro_weth = ZERO;
        price.uniswap_gvt_gro = ZERO;
        price.uniswap_gro_usdc = ZERO;
        price.curve_pwrd3crv = ZERO;
    }
    return price;
}

// Triggered by PnLExecution events
export const setGvtPrice = (): void => {
    let price = initPrice();
    price.gvt = getPricePerShare('gvt');
    price.save();
}

// Triggered by UniswapV2 Gro-Usdc swap events
// export const setGroPrice = (contractAddress: Address): void => {
//     // const groPrice = getUniV2Price(UNISWAPV2_GRO_USDC_ADDRESS);
//     const groPrice = getUniV2Price(contractAddress, true);
//     if (groPrice != ZERO) {
//         let price = initPrice();
//         price.gro = groPrice;
//         price.save();
//     }
// }

// Triggered by UniswapV2 Gro-Usdc swap events
// TODO
export const setWethPrice = (): void => {
    const wethPrice = getUniV2Price(UNISWAPV2_USDC_WETH_ADDRESS, true);
    if (wethPrice != ZERO) {
        let price = initPrice();
        price.weth = wethPrice;
        price.save();
    }
}

// export const setPwrd3CRVPrice = (): void => {
//     const curve_pwrd3crv = getCurvePwrd3crvPrice(true);
//     if (curve_pwrd3crv != ZERO) {
//         let price = initPrice();
//         price.curve_pwrd3crv = curve_pwrd3crv;
//         price.save();
//     }
// }

// TODO: update gro price as well (knowing gvt price, we can update gro)
export const setUniswapGvtGroPrice = (): void => {
    const contract = UniswapV2PairGvtGro.bind(UNISWAPV2_GVT_GRO_ADDRESS);
    const reserves = contract.try_getReserves();
    const _totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('setters/price.ts/setUniswapGvtGroPrice()->try_getReserves() reverted', []);
    } else if (_totalSupply.reverted) {
        log.error('setters/price.ts/setUniswapGvtGroPrice()->try_totalSupply() reverted', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const gvtReserve = tokenToDecimal(reserves.value.get_reserve0(), 18, 7);
        const groReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);

        // update Pool data
        updatePoolData(
            1,
            UNISWAPV2_GVT_GRO_ADDRESS.toHexString(),
            gvtReserve,
            groReserve,
            totalSupply,
        );

        // update GRO price
        // TODO: chainlink to calc the USD price of USDC.

        // update lpToken price
        const price = initPrice();
        const oneGvt = (ONE.div(totalSupply)).times(gvtReserve);
        const oneGro = (ONE.div(totalSupply)).times(groReserve);
        const oneGvtValue = oneGvt.times(price.gvt);
        const oneGroValue = oneGro.times(price.gro);
        const oneLpValue = oneGvtValue.plus(oneGroValue);
        price.uniswap_gvt_gro = oneLpValue.truncate(DECIMALS);
        price.save();
    }
}

export const setUniswapGroUsdcPrice = (): void => {
    const contract = UniswapV2PairGvtGro.bind(UNISWAPV2_GRO_USDC_ADDRESS);
    const reserves = contract.try_getReserves();
    const _totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('setters/price.ts/setUniswapGroUsdcPrice()->try_getReserves() reverted', []);
    } else if (_totalSupply.reverted) {
        log.error('setters/price.ts/setUniswapGroUsdcPrice()->try_totalSupply() reverted', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const groReserve = tokenToDecimal(reserves.value.get_reserve0(), 18, 7);
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve1(), 6, 7);

        // update Pool data
        updatePoolData(
            2,
            UNISWAPV2_GRO_USDC_ADDRESS.toHexString(),
            groReserve,
            usdcReserve,
            totalSupply,
        );

        // update GRO price
        // TODO: chainlink to calc the USD price of USDC.
        const price = initPrice();
        const groPricePerShare = usdcReserve.div(groReserve).truncate(DECIMALS);
        price.gro = groPricePerShare;

        // update lpToken price
        const oneGro = (ONE.div(totalSupply)).times(groReserve);
        const oneUsdc = (ONE.div(totalSupply)).times(usdcReserve);
        const oneGroValue = oneGro.times(price.gro);
        const oneUsdcValue = oneUsdc.times(ONE/*price.usdc*/); //TODO
        const lpPricePerShare = oneGroValue.plus(oneUsdcValue);
        price.uniswap_gro_usdc = lpPricePerShare.truncate(DECIMALS);
        price.save();
    }
}

export const setCurvePwrd3crvPrice = (): void => {
    const contract = CurveMetapool3CRV.bind(CURVE_PWRD_3CRV_ADDRESS);
    const reserves = contract.try_get_balances();
    const totalSupply = contract.try_totalSupply();
    const virtualPrice = contract.try_get_virtual_price();
    if (reserves.reverted) {
        log.error('setters/price.ts/setCurvePwrd3crvPrice()->try_get_balances() reverted', []);
    } else if (totalSupply.reverted) {
        log.error('setters/price.ts/setCurvePwrd3crvPrice()->try_totalSupply() reverted', []);
    } else if (virtualPrice.reverted) {
        log.error('setters/price.ts/setCurvePwrd3crvPrice()->try_get_virtual_price() reverted', []);
    } else {
        const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
        const crv_reserve = tokenToDecimal(reserves.value[0], 18, 7);
        const pwrd_reserve = tokenToDecimal(reserves.value[1], 18, 7);

        // update Pool data
        updatePoolData(
            4,
            CURVE_PWRD_3CRV_ADDRESS.toHexString(),
            crv_reserve,
            pwrd_reserve,
            total_supply,
        );

        // update lpToken price
        const price = initPrice();
        const lpPricePerShare = tokenToDecimal(virtualPrice.value, 18, 7);
        price.curve_pwrd3crv = lpPricePerShare;
        price.save();
    }
}