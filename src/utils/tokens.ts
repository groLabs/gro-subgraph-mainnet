import { Gvt } from '../../generated/Gvt/Gvt';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
import {
    log,
    Address,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    DECIMALS,
    GVT_ADDRESS,
    PWRD_ADDRESS,
    UNISWAPV2_GRO_USDC_ADDRESS,
    UNISWAPV2_USDC_WETH_ADDRESS,
} from '../utils/constants';
import { getUniV2Price } from '../utils/pool';
// import { initPrice } from '../setters/price';


// TEMPORARILY COPIED HERE
import { Price } from '../../generated/schema';
export const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = NUM.ONE;
        price.gvt = NUM.ZERO;
        price.gro = NUM.ZERO;
        price.weth = NUM.ZERO;
        price.balancer_gro_weth = NUM.ZERO;
        price.uniswap_gvt_gro = NUM.ZERO;
        price.uniswap_gro_usdc = NUM.ZERO;
        price.curve_pwrd3crv = NUM.ZERO;
    }
    return price;
}


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
        return NUM.ZERO;
    } else {
        return tokenToDecimal(pricePerShare.value, 18, 7);
    }
}

// Retrieves price per share for a given token
export const getPricePerShare = (token: string): BigDecimal => {
    let price: BigDecimal = NUM.ZERO;
    if (token === 'gvt') {
        price = getGvtPrice();
    } else if (token === 'gro') {
        // TODO: retrieve it from latest prices.gro
        // price = getUniV2Price(UNISWAPV2_GRO_USDC_ADDRESS, false);
        const _price = initPrice();
        price = _price.gro;
    } else if (
        token === 'pwrd'
        || token === 'dai'
        || token === 'usdc'
        || token === 'usdt'
    ) {
        price = NUM.ONE;
    } else {
        // TODO: show log
    }
    return price;
}

export const getTokenByPoolId = (
    poolId: i32,
): string => {
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
export function tokenToDecimal(
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
export const getFactor = (token: string): BigDecimal => {
    if (token === 'gvt') {
        const contract = Gvt.bind(GVT_ADDRESS);
        const gvtFactor = contract.try_factor();
        if (gvtFactor.reverted) {
            log.error('getFactor() on gvt reverted in src/utils/tokens.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(gvtFactor.value, 18, 12);
        }
    } else if (token === 'pwrd') {
        const contract = Pwrd.bind(PWRD_ADDRESS);
        const pwrdFactor = contract.try_factor();
        if (pwrdFactor.reverted) {
            log.error('getFactor() on pwrd reverted in src/utils/tokens.ts', []);
            return NUM.ZERO;
        } else {
            return tokenToDecimal(pwrdFactor.value, 18, 12);
        }
    } else {
        return NUM.ZERO;
    }
}
