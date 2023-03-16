// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Contains token-related utility functions

import { Gvt } from '../../generated/Gvt/Gvt';
import { UniswapV2Pair } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import {
    AccessControlledOffchainAggregator as ChainlinkAggregator
} from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';
import {
    NUM,
    ADDR,
    DECIMALS,
    TOKEN as Token,
} from '../utils/constants';
import {
    log,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    gvtAddress,
    uni2UsdcWethAddress,
    chainlinkDaiUsdAddress,
    chainlinkUsdcUsdAddress,
    chainlinkUsdtUsdAddress,
} from '../utils/contracts';


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

/// @return gvt or pwrd depending on the <isPwrd> parameter
/// @dev <isPwrd>: the deposit or withdrawal field that indicates the token type:
///     - For DepositHandler & WithdrawHandler: field `pwrd` (true: pwrd, false: gvt)
///     - For GRouter: field `tranche` (true: pwrd, false: gvt)
export const getGroToken = (isPwrd: bool): string => {
    return (isPwrd)
        ? Token.PWRD
        : Token.GVT;
}

/// @return price per share given a token type
export const getPricePerShare = (token: string): BigDecimal => {
    let price: BigDecimal = NUM.ZERO;
    if (token === Token.GVT) {
        const contract = Gvt.bind(gvtAddress);
        const pricePerShare = contract.try_getPricePerShare();
        if (pricePerShare.reverted) {
            log.error('getPricePerShare(): try_getPricePerShare() reverted in /utils/tokens.ts', []);
            return price;
        } else {
            return tokenToDecimal(pricePerShare.value, 18, DECIMALS);
        }
    } else if (token === Token.GRO) {
        const _price = initPrice();
        price = _price.gro;
    } else if (
        token === Token.PWRD
        || token === Token.DAI
        || token === Token.USDC
        || token === Token.USDT
    ) {
        price = NUM.ONE;
    } else {
        log.error('getPricePerShare(): token {} not found in /utils/tokens.ts', [token]);
    }
    return price;
}

/// @return token type given a pool identifier
export const getTokenByPoolId = (
    poolId: i32,
): string => {
    switch (poolId) {
        case 0:
            return Token.GRO;
        case 1:
            return Token.UNISWAP_GVT_GRO;
        case 2:
            return Token.UNISWAP_GRO_USDC;
        case 3:
            return Token.GVT;
        case 4:
            return Token.CURVE_PWRD3CRV;
        case 5:
            return Token.BALANCER_GRO_WETH;
        case 6:
            return Token.PWRD;
        default:
            return Token.UNKNOWN;
    }
}

/// @notice Converts a BigInt to BigDecimal
/// @param amount the amount to be converted
/// @param factor the base conversion factor (1eN)
/// @param decimals the decimal precision (normally 7)
/// @return the converted BigDecimal
export function tokenToDecimal(
    amount: BigInt,
    factor: i32,
    decimals: i32,
): BigDecimal {
    const scale = BigInt.fromI32(10)
        .pow(factor as u8)
        .toBigDecimal();
    return amount.toBigDecimal()
        .div(scale)
        .truncate(decimals);
}

/// @notice Converts an stablecoin amount to its USD value
/// @param coin the coin type (dai, usdc, usdt) 
/// @param amount the coin amount
/// @return the USD value
export const amountToUsd = (
    coin: string,
    amount: BigDecimal
): BigDecimal => {
    let price = NUM.ZERO;
    if (coin == Token.THREE_CRV) {
        const _price = initPrice();
        price = _price.three_crv;
    } else {
        price = getStablecoinUsdPrice(coin);
    }
    return amount.times(price).truncate(DECIMALS);
}

/// @notice Gives the USD value in BigInt for a given stablecoin amount
///         (dai, usdc, usdt or 3crv)
/// @dev Only used for G2 withdrawals
/// @param tokenIndex the <tokenIndex> field from GRouter withdrawals 
/// @param amount the coin amount
/// @return the USD value in BigInt
export const getUSDAmountOfShare = (
    tokenIndex: number,
    coinAmount: BigDecimal
): BigInt => {
    let usdAmount = NUM.ZERO;
    const addDecimal = BigInt.fromI32(10).pow(12).toBigDecimal();
    if (tokenIndex == 0) {
        usdAmount = amountToUsd(Token.DAI, coinAmount);
    } else if (tokenIndex == 1) {
        usdAmount = amountToUsd(Token.USDC, coinAmount)
            .times(addDecimal);
    } else if (tokenIndex == 2) {
        usdAmount = amountToUsd(Token.USDT, coinAmount)
            .times(addDecimal);
    } else if (tokenIndex == 3) {
        usdAmount = amountToUsd(Token.THREE_CRV, coinAmount);
    }
    return BigInt.fromString(usdAmount.truncate(0).toString());
}

/// @notice Gives the USD value in BigDecimal for a given stablecoin type
///         (dai, usdc, usdt) based on Chainlink prices
/// @param token the token type
/// @return the USD value in BigDecimal
export function getStablecoinUsdPrice(token: string): BigDecimal {
    const chainlinkAddress: Address = (token === Token.DAI)
        ? chainlinkDaiUsdAddress
        : (token === Token.USDC)
            ? chainlinkUsdcUsdAddress
            : (token === Token.USDT)
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

/// @return the USDC value of a WETH
/// @dev Using USDC instead of USD to avoid one more call to Chainlink
export function getWethPrice(): BigDecimal {
    const contract = UniswapV2Pair.bind(uni2UsdcWethAddress);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.error('setWethPrice(): try_getReserves() reverted in /setters/price.ts', []);
        return NUM.ZERO;
    } else {
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve0(), 6, DECIMALS);
        const wethReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, DECIMALS);
        // OPTIONAL: chainlink to calc the USD price of USDC.
        const price = usdcReserve.div(wethReserve).truncate(DECIMALS);
        return price;
    }
}
