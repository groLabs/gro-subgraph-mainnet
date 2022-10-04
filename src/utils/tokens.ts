import { Gvt } from '../../generated/Gvt/Gvt';
import { Pwrd } from '../../generated/Pwrd/Pwrd';
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
import { getUniV2Price } from '../utils/pool';


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

// Retrieves price per share for a given token
export const getPricePerShare = (token: string): BigDecimal => {
    let price: BigDecimal = ZERO;
    if (token === 'gvt') {
        price = getGvtPrice();
    } else if (token === 'gro') {
        price = getUniV2Price(UNISWAPV2_GRO_USDC_ADDRESS, false);
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
