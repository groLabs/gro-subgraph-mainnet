import { Gvt } from '../../generated/Gvt/Gvt';
import { UniswapV2Pair } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import {
    AccessControlledOffchainAggregator as ChainlinkAggregator
} from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import {
    gvtAddress,
    uni2UsdcWethAddress,
    chainlinkDaiUsdAddress,
    chainlinkUsdcUsdAddress,
    chainlinkUsdtUsdAddress,
} from '../utils/contracts';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import {
    log,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


// TEMPORARILY COPIED HERE (generates exception otherwise)
import { Price } from '../../generated/schema';
export const initPrice = (): Price => {
    let price = Price.load(ADDR.ZERO);
    if (!price) {
        price = new Price(ADDR.ZERO);
        price.pwrd = NUM.ONE;
        price.gvt = NUM.ZERO;
        price.gro = NUM.ZERO;
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

// converts a Bigdecimal coin amount to USD value
export const amountToUsd = (
    coin: string,
    amount: BigDecimal
): BigDecimal => {
    let price = NUM.ZERO;
    if (coin == '3crv') {
        const _price = initPrice();
        price = _price.three_crv;
    } else {
        price = getStablecoinUsdPrice(coin);
    }
    return amount.times(price).truncate(DECIMALS);
}

// returns the USD value in BigInt of a given stablecoin amount (used for G2 withdrawals)
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

// returns the USD value of a given stablecoin (DAI, USDC or USDT)
export function getStablecoinUsdPrice(token: string): BigDecimal {
    const chainlinkAddress: Address = (token === 'dai')
        ? chainlinkDaiUsdAddress
        : (token === 'usdc')
            ? chainlinkUsdcUsdAddress
            : (token === 'usdt')
                ? chainlinkUsdtUsdAddress
                : Address.zero();
    const contract = ChainlinkAggregator.bind(chainlinkAddress);
    const latestRound = contract.try_latestRoundData();
    if (latestRound.reverted) {
        log.error('getStablecoinUsdPrice(): try_latestRoundData() reverted in /utils/token.ts', []);
        return NUM.ZERO;
    } else {
        const usdPrice = tokenToDecimal(latestRound.value.getAnswer(), 8, DECIMALS);
        return usdPrice;
    }
}

export function getWethPrice(): BigDecimal {
    const contract = UniswapV2Pair.bind(uni2UsdcWethAddress);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.error('setWethPrice(): try_getReserves() reverted in /setters/price.ts', []);
        return NUM.ZERO;
    } else {
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve0(), 6, DECIMALS);
        const wethReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, DECIMALS);
        // TODO: update WETH price
        // TODO: chainlink to calc the USD price of USDC.
        const price = usdcReserve.div(wethReserve).truncate(DECIMALS);
        return price;
    }
}
