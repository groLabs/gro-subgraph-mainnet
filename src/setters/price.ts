// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice Updates the Gro-related token prices

import { Tx } from '../types/tx';
import { updatePoolData } from './poolData';
import { Price } from '../../generated/schema';
import {
    tokenToDecimal,
    getWethPrice,
    getPricePerShare,
    getStablecoinUsdPrice,
} from '../utils/tokens';
import {
    log,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
    DECIMALS,
    TOKEN as Token,
    GRO_WETH_POOL_START_BLOCK,
    BALANCER_GRO_WETH_POOLID,
} from '../utils/constants';
import {
    threePoolAddress,
    uni2GvtGroAddress,
    uni2GroUsdcAddress,
    curveMetapoolAddress,
    balGroWethVaultAddress,
    balGroWethPoolAddress,
} from '../utils/contracts';
// contracts
import { ThreePool } from '../../generated/ChainlinkAggregator/ThreePool';
import { UniswapV2Pair } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { Vault as BalancerGroWethVault } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerGroWethPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import { Vyper_contract as CurveMetapool3CRV } from '../../generated/CurveMetapool3CRV/Vyper_contract';


/// @notice Initialises entity <Price> with default zero values if not created yet
/// @return Price object
export const initPrice = (): Price => {
    let price = Price.load(ADDR.ZERO);
    if (!price) {
        price = new Price(ADDR.ZERO);
        price.pwrd = NUM.ONE;
        price.gvt = NUM.ZERO;
        price.gro = NUM.ZERO;
        price.three_crv = NUM.ZERO;
        price.balancer_gro_weth = NUM.ZERO;
        price.uniswap_gvt_gro = NUM.ZERO;
        price.uniswap_gro_usdc = NUM.ZERO;
        price.curve_pwrd3crv = NUM.ZERO;
    }
    return price;
}

/// @notice Updates the gvt price in entity <Price>
/// @dev Triggered by the following contract events:
///         - <LogPnLExecution> from PnL
///         - <LogStrategyHarvestReport> from GVault
///         - <LogDeposit>, <LogLegacyDeposit> & <LogWithdrawal> from GRouter
export const setGvtPrice = (): void => {
    let price = initPrice();
    price.gvt = getPricePerShare(Token.GVT);
    price.save();
}

/// @notice Updates the three_crv price in entity <Price>
/// @dev Triggered by Chainlink <AnswerUpdated> event in a daily basis
export const set3CrvPrice = (): void => {
    const contract = ThreePool.bind(threePoolAddress);
    const virtualPrice = contract.try_get_virtual_price();
    if (virtualPrice.reverted) {
        log.error('set3CrvPrice(): try_get_virtual_price() reverted in /setters/price.ts', []);
    } else {
        const crvPrice = tokenToDecimal(virtualPrice.value, 18, DECIMALS);
        let price = initPrice();
        price.three_crv = crvPrice;
        price.save();
    }
}

/// @notice Updates the uniswap_gvt_gro price in entity <Price> and the 
///         total supply & reserves of Uniswap GVT/GRO Pool in entity <PoolData>
/// @dev Triggered by <Swap> events from Uniswap GVT/GRO pool
export const setUniswapGvtGroPrice = (): void => {
    const contract = UniswapV2Pair.bind(uni2GvtGroAddress);
    const reserves = contract.try_getReserves();
    const _totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('setUniswapGvtGroPrice(): try_getReserves() reverted in /setters/price.ts', []);
    } else if (_totalSupply.reverted) {
        log.error('setUniswapGvtGroPrice(): try_totalSupply() reverted in /setters/price.ts', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const gvtReserve = tokenToDecimal(reserves.value.get_reserve0(), 18, DECIMALS);
        const groReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, DECIMALS);
        // update Pool-1 data
        updatePoolData(
            1,
            uni2GvtGroAddress,
            gvtReserve,
            groReserve,
            totalSupply,
        );
        // TODO: update GRO price (knowing gvt price, we can update gro)
        // TODO: chainlink to calc the USD price of USDC.
        // update lpToken price
        const price = initPrice();
        const oneGvt = (NUM.ONE.div(totalSupply)).times(gvtReserve);
        const oneGro = (NUM.ONE.div(totalSupply)).times(groReserve);
        const oneGvtValue = oneGvt.times(price.gvt);
        const oneGroValue = oneGro.times(price.gro);
        const oneLpValue = oneGvtValue.plus(oneGroValue);
        price.uniswap_gvt_gro = oneLpValue.truncate(DECIMALS);
        price.save();
    }
}

/// @notice Updates the uniswap_gro_usdc price in entity <Price> and the 
///         total supply & reserves of Uniswap GRO/USDC in entity <PoolData>
/// @dev - Triggered by <Swap> events from Uniswap GRO/USDC
///      - Gro token was circulating before this pool creation,
//         so any tx before won't have gro price
export const setUniswapGroUsdcPrice = (): void => {
    const contract = UniswapV2Pair.bind(uni2GroUsdcAddress);
    const reserves = contract.try_getReserves();
    const _totalSupply = contract.try_totalSupply();
    if (reserves.reverted) {
        log.error('setUniswapGroUsdcPrice(): try_getReserves() reverted in /setters/price.ts', []);
    } else if (_totalSupply.reverted) {
        log.error('setUniswapGroUsdcPrice(): try_totalSupply() reverted in /setters/price.ts', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const groReserve = tokenToDecimal(reserves.value.get_reserve0(), 18, DECIMALS);
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve1(), 6, DECIMALS);
        // update Pool-2 data
        updatePoolData(
            2,
            uni2GroUsdcAddress,
            groReserve,
            usdcReserve,
            totalSupply,
        );
        // update GRO price (in USD value)
        const price = initPrice();
        const priceUSDC = getStablecoinUsdPrice('usdc');
        const usdReserve = usdcReserve.times(priceUSDC);
        const groPricePerShare = usdReserve.div(groReserve).truncate(DECIMALS);
        price.gro = groPricePerShare;
        // update lpToken price
        const oneGroAmount = (NUM.ONE.div(totalSupply)).times(groReserve);
        const oneUsdcAmount = (NUM.ONE.div(totalSupply)).times(usdcReserve);
        const oneGroValue = oneGroAmount.times(price.gro);
        const oneUsdcValue = oneUsdcAmount.times(priceUSDC);
        const lpPricePerShare = oneGroValue.plus(oneUsdcValue);
        price.uniswap_gro_usdc = lpPricePerShare.truncate(DECIMALS);
        price.save();
    }
}

/// @notice Updates the curve_pwrd3crv price in entity <Price> and the 
///         total supply & reserves of Curve MetaPool 3CRVPWRD in entity <PoolData>
/// @dev Triggered by <TokenExchange> & <TokenExchangeUnderlying> events from Curve MetaPool 3CRVPWRD
export const setCurvePwrd3crvPrice = (): void => {
    const contract = CurveMetapool3CRV.bind(curveMetapoolAddress);
    const reserves = contract.try_get_balances();
    const totalSupply = contract.try_totalSupply();
    const virtualPrice = contract.try_get_virtual_price();
    if (reserves.reverted) {
        log.error('setCurvePwrd3crvPrice(): try_get_balances() reverted in /setters/price.ts', []);
    } else if (totalSupply.reverted) {
        log.error('setCurvePwrd3crvPrice(): try_totalSupply() reverted in /setters/price.ts', []);
    } else if (virtualPrice.reverted) {
        log.error('setCurvePwrd3crvPrice(): try_get_virtual_price() reverted in /setters/price.ts', []);
    } else {
        const total_supply = tokenToDecimal(totalSupply.value, 18, 12);
        const crv_reserve = tokenToDecimal(reserves.value[0], 18, DECIMALS);
        const pwrd_reserve = tokenToDecimal(reserves.value[1], 18, DECIMALS);
        // update Pool-4 data
        updatePoolData(
            4,
            curveMetapoolAddress,
            crv_reserve,
            pwrd_reserve,
            total_supply,
        );
        // update lpToken price
        const price = initPrice();
        const lpPricePerShare = tokenToDecimal(virtualPrice.value, 18, DECIMALS);
        price.curve_pwrd3crv = lpPricePerShare;
        price.save();
    }
}

/// @notice Updates the balancer_gro_weth price in entity <Price> and the 
///         total supply & reserves of Balancer GRO/WETH Pool in entity <PoolData>
/// @dev Triggered by Balancer Pool <Transfer> and regular Chainlink <AnswerUpdated> events
export const setBalancerGroWethPrice = (tx: Tx): void => {
    const contractVault = BalancerGroWethVault.bind(balGroWethVaultAddress);
    const contractPool = BalancerGroWethPool.bind(balGroWethPoolAddress);
    const _totalSupply = contractPool.try_totalSupply();
    const poolTokens = contractVault.try_getPoolTokens(BALANCER_GRO_WETH_POOLID);
    const path = 'in setters/price.ts';
    if (tx.block < GRO_WETH_POOL_START_BLOCK) {
        log.warning(
            `setBalancerGroWethPrice(): GRO/WETH Vault updates before its pool creation ${tx.msg} ${path}`,
            tx.data
        )
    } else if (_totalSupply.reverted) {
        log.error(
            `setBalancerGroWethPrice(): try_totalSupply() reverted ${tx.msg} ${path}`,
            tx.data
        );
    } else if (poolTokens.reverted) {
        log.error(
            `setBalancerGroWethPrice(): try_getPoolTokens() reverted ${tx.msg} ${path}`,
            tx.data
        );
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const reserves = poolTokens.value.getBalances().map<BigDecimal>(
            (item: BigInt) => tokenToDecimal(item, 18, DECIMALS)
        );
        if (reserves.length !== 2) {
            log.error(
                `setBalancerGroWethPrice(): wrong reserves pair ${tx.msg} ${path}`,
                tx.data
            );
        } else {
            const groReserve = reserves[0];
            const wethReserve = reserves[1];
            // update Pool-5 data
            updatePoolData(
                5,
                balGroWethPoolAddress,
                groReserve,
                wethReserve,
                totalSupply,
            );
            // update lpToken price
            const price = initPrice();
            const priceWeth = getWethPrice();
            const oneGro = (NUM.ONE.div(totalSupply)).times(groReserve);
            const oneWeth = (NUM.ONE.div(totalSupply)).times(wethReserve);
            const oneGroValue = oneGro.times(price.gro);
            const oneWethValue = oneWeth.times(priceWeth);
            const lpPricePerShare = oneGroValue.plus(oneWethValue);
            price.balancer_gro_weth = lpPricePerShare.truncate(DECIMALS);
            price.save();
        }
    }
}
