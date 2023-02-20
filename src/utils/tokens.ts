import { Gvt } from '../../generated/Gvt/Gvt';
import { gvtAddress } from '../utils/contracts';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    log,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';


// TEMPORARILY COPIED HERE (generates exception otherwise)
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
    const contract = Gvt.bind(gvtAddress);
    const pricePerShare = contract.try_getPricePerShare();
    if (pricePerShare.reverted) {
        log.error('getGvtPrice(): try_getPricePerShare() reverted in /utils/tokens.ts', []);
        return NUM.ZERO;
    } else {
        return tokenToDecimal(pricePerShare.value, 18, DECIMALS);
    }
}

// Retrieves price per share for a given token
export const getPricePerShare = (token: string): BigDecimal => {
    let price: BigDecimal = NUM.ZERO;
    if (token === 'gvt') {
        price = getGvtPrice();
    } else if (token === 'gro') {
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
        log.error('getPricePerShare(): token {} not found in /utils/tokens.ts', [token]);
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

export const amountToUsd = (
    coin: string,
    amount: BigDecimal
): BigDecimal => {
    const _price = initPrice();
    const price = (coin == 'dai')
        ? _price.dai
        : (coin == 'usdc')
            ? _price.usdc
            : (coin == 'usdt')
                ? _price.usdt
                : (coin == '3crv')
                    ? _price.three_crv
                    : NUM.ZERO;
    return amount.times(price).truncate(DECIMALS);
}

export const getUSDAmountOfShare = (
    tokenIndex: number,
    coinAmount: BigDecimal
): BigInt => {
    let usdAmount = NUM.ZERO;
    const addDecimal = BigInt.fromI32(10).pow(12).toBigDecimal();

    if (tokenIndex == 0) {
        usdAmount = amountToUsd('dai', coinAmount);
    } else if (tokenIndex == 1) {
        usdAmount = amountToUsd('usdc', coinAmount)
            .times(addDecimal);
    } else if (tokenIndex == 2) {
        usdAmount = amountToUsd('usdt', coinAmount)
            .times(addDecimal);
    } else if (tokenIndex == 3) {
        usdAmount = amountToUsd('3crv', coinAmount);
    }
    return BigInt.fromString(usdAmount.truncate(0).toString());
}
