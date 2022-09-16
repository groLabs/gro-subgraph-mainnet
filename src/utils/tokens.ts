import { Gvt } from '../../generated/Gvt/Gvt';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
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


export const getGroToken = (isPwrd: bool): string => {
    return (isPwrd)
        ? 'pwrd'
        : 'gvt';
}

export const getGvtPrice = (): BigDecimal => {
    const contract = Gvt.bind(GVT_ADDRESS);
    const pricePerShare = contract.try_getPricePerShare();
    if (pricePerShare.reverted) {
        log.error('getGvtPrice() reverted in src/utils/tokens.ts', []);
        return ZERO;
    } else {
        return tokenToDecimal(pricePerShare.value, 18, 7);
    }
}

export const getUniV2Price = (poolAddress: Address): BigDecimal => {
    const contract = UniswapV2Pair.bind(poolAddress);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.error('getUniV2Price() reverted in src/utils/tokens.ts', []);
        return ZERO;
    } else {
        if (poolAddress == UNISWAPV2_GRO_USDC_ADDRESS) {
            // return GRO price per share
            const gvt_reserve = reserves.value.get_reserve0();
            const usdc_reserve = reserves.value.get_reserve1();
            // TODO: chainlink to calc the USD price of USDC.
            const pps = tokenToDecimal(usdc_reserve, 6, 7).div(tokenToDecimal(gvt_reserve, 18, 7)).truncate(DECIMALS);
            return pps;
        } else if (poolAddress == UNISWAPV2_USDC_WETH_ADDRESS) {
            // return WETH price per share
            const usdc_reserve = reserves.value.get_reserve0();
            const weth_reserve = reserves.value.get_reserve1();
            // TODO: chainlink to calc the USD price of USDC.
            const pps = tokenToDecimal(usdc_reserve, 6, 7).div(tokenToDecimal(weth_reserve, 18, 7)).truncate(DECIMALS);
            return pps;
        } else {
            return ZERO;
        }
    }
}

// Retrieves price per share for a given token
const getPricePerShare = (token: string): BigDecimal => {
    let price: BigDecimal = ZERO;
    if (token === 'gvt') {
        price = getGvtPrice();
    } else if (token === 'gro') {
        price = getUniV2Price(UNISWAPV2_GRO_USDC_ADDRESS);
    } else if (
        token === 'pwrd'
        || token === 'dai'
        || token === 'usdc'
        || token === 'usdt'
    ) {
        price = ONE;
    } else {
        // TODO: show log
    }
    return price;
}

const getTokenFromPoolId = (
    poolId: i32,
    type: string
): string => {
    if (type === 'claim') return 'gro'
    switch (poolId) {
        case 0:
            return 'gro';
        case 1:
            return 'uniswap_gvt_gro';
        case 2:
            return 'uniswap_gro_usdc';
        case 3:
            return 'gvt';
        case 4:
            return 'curve_pwrd3crv';
        case 5:
            return 'balancer_gro_weth';
        case 6:
            return 'pwrd';
        default:
            return 'unknown';
    }
}

// Converts a BigInt into a N-decimal BigDecimal
function tokenToDecimal(
    amount: BigInt,
    precision: i32,
    decimals: i32,
): BigDecimal {
    const scale = BigInt.fromI32(10)
        .pow(precision as u8)
        .toBigDecimal();
    return amount.toBigDecimal()
        .div(scale)
        .truncate(decimals);
}

// Retrieves gvt or pwrd factor at the time of a transfer
const getFactor = (token: string): BigDecimal => {
    if (token === 'gvt') {
        const contract = Gvt.bind(GVT_ADDRESS);
        const gvtFactor = contract.try_factor();
        if (gvtFactor.reverted) {
            log.error('getFactor() on gvt reverted in src/utils/tokens.ts', []);
            return ZERO;
        } else {
            return tokenToDecimal(gvtFactor.value, 18, 12);
        }
    } else if (token === 'pwrd') {
        const contract = Pwrd.bind(PWRD_ADDRESS);
        const pwrdFactor = contract.try_factor();
        if (pwrdFactor.reverted) {
            log.error('getFactor() on pwrd reverted in src/utils/tokens.ts', []);
            return ZERO;
        } else {
            return tokenToDecimal(pwrdFactor.value, 18, 12);
        }
    } else {
        return ZERO;
    }
}

export {
    getPricePerShare,
    getTokenFromPoolId,
    tokenToDecimal,
    getFactor,
}
