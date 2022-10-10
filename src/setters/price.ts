import { Price } from '../../generated/schema';
import {
    log,
    BigInt,
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
    BALANCER_GRO_WETH_POOLID,
    BALANCER_GRO_WETH_POOL_ADDRESS,
    BALANCER_GRO_WETH_VAULT_ADDRESS,
    CHAINLINK_DAI_USD_ADDRESS,
    CHAINLINK_USDC_USD_ADDRESS,
    CHAINLINK_USDT_USD_ADDRESS,
} from '../utils/constants';
import { updatePoolData } from './poolData';
import { getPricePerShare, tokenToDecimal } from '../utils/tokens';
// contracts
import { UniswapV2Pair } from '../../generated/UniswapV2PairGvtGro/UniswapV2Pair';
import { Vault as BalancerGroWethVault } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerGroWethPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import { Vyper_contract as CurveMetapool3CRV } from '../../generated/CurveMetapool3CRV/Vyper_contract';
import { AccessControlledOffchainAggregator as ChainlinkAggregator } from '../../generated/ChainlinkAggregator/AccessControlledOffchainAggregator';


// export function initPrice(): Price {
export const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = ONE;
        price.gvt = ZERO;
        price.gro = ZERO;
        price.weth = ZERO;
        price.dai = ZERO;
        price.usdc = ZERO;
        price.usdt = ZERO;
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

// TODO: update gro price as well (knowing gvt price, we can update gro)
export const setUniswapGvtGroPrice = (): void => {
    const contract = UniswapV2Pair.bind(UNISWAPV2_GVT_GRO_ADDRESS);
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
    const contract = UniswapV2Pair.bind(UNISWAPV2_GRO_USDC_ADDRESS);
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
        const price = initPrice();
        const usdReserve = usdcReserve.times(price.usdc)
        const groPricePerShare = usdReserve.div(groReserve).truncate(DECIMALS);
        price.gro = groPricePerShare;

        // update lpToken price
        const oneGroAmount = (ONE.div(totalSupply)).times(groReserve);
        const oneUsdcAmount = (ONE.div(totalSupply)).times(usdcReserve);
        const oneGroValue = oneGroAmount.times(price.gro);
        const oneUsdcValue = oneUsdcAmount.times(price.usdc);
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

export const setBalancerGroWethPrice = (): void => {
    const contractVault = BalancerGroWethVault.bind(BALANCER_GRO_WETH_VAULT_ADDRESS);
    const contractPool = BalancerGroWethPool.bind(BALANCER_GRO_WETH_POOL_ADDRESS);
    const _totalSupply = contractPool.try_totalSupply();
    const poolTokens = contractVault.try_getPoolTokens(BALANCER_GRO_WETH_POOLID);
    if (_totalSupply.reverted) {
        log.error('setters/price.ts/setBalancerGroWethPrice()->try_totalSupply() reverted', []);
    } else if (poolTokens.reverted) {
        log.error('setters/price.ts/setBalancerGroWethPrice()->try_getPoolTokens() reverted', []);
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const reserves = poolTokens.value.getBalances().map<BigDecimal>((item: BigInt) => tokenToDecimal(item, 18, 7));
        if (reserves.length !== 2) {
            log.error('setters/price.ts/setBalancerGroWethPrice(): wrong reserves pair', []);
        } else {
            const groReserve = reserves[0];
            const wethReserve = reserves[1];

            // update Pool data
            updatePoolData(
                5,
                BALANCER_GRO_WETH_POOL_ADDRESS.toHexString(),
                groReserve,
                wethReserve,
                totalSupply,
            );

            // update lpToken price
            const price = initPrice();
            const oneGro = (ONE.div(totalSupply)).times(groReserve);
            const oneWeth = (ONE.div(totalSupply)).times(wethReserve);
            const oneGroValue = oneGro.times(price.gro);
            const oneWethValue = oneWeth.times(price.weth);
            const lpPricePerShare = oneGroValue.plus(oneWethValue);
            price.balancer_gro_weth = lpPricePerShare.truncate(DECIMALS);
            price.save();
        }
    }
}

export const setWethPrice = (): void => {
    const contract = UniswapV2Pair.bind(UNISWAPV2_USDC_WETH_ADDRESS);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.error('setters/price.ts/setWethPrice()->try_getReserves() reverted', []);
    } else {
        const usdcReserve = tokenToDecimal(reserves.value.get_reserve0(), 6, 7);
        const wethReserve = tokenToDecimal(reserves.value.get_reserve1(), 18, 7);

        // update WETH price
        // TODO: chainlink to calc the USD price of USDC.
        const price = initPrice();
        price.weth = usdcReserve.div(wethReserve).truncate(DECIMALS);
        price.save();
    }
}

export const setStableCoinPrice = (
    contractAddress: Address,
): void => {
    const contract = ChainlinkAggregator.bind(contractAddress);
    const latestRound = contract.try_latestRoundData();
    if (latestRound.reverted) {
        log.error('setters/price.ts/setStableCoinPrice()->try_latestRoundData() reverted', []);
    } else {
        const usdPrice = tokenToDecimal(latestRound.value.getAnswer(), 8, 7);
        const price = initPrice();
        if (contractAddress == CHAINLINK_DAI_USD_ADDRESS) {
            price.dai = usdPrice;
        } else if (contractAddress == CHAINLINK_USDC_USD_ADDRESS) {
            price.usdc = usdPrice;
        } else if (contractAddress == CHAINLINK_USDT_USD_ADDRESS) {
            price.usdt = usdPrice;
        } else {
            log.error(
                'setters/price.ts/setStableCoinPrice()->Unknown chainlink feed address',
                [contractAddress.toHexString()]
            );
        }
        price.save();
    }
}
