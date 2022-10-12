import { Price } from '../../generated/schema';
import {
    log,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    ADDR,
    DECIMALS,
    GENESIS_POOL_GRO_WETH,
    BALANCER_GRO_WETH_POOLID,
} from '../utils/constants';
import { updatePoolData } from './poolData';
import {
    getPricePerShare,
    tokenToDecimal
} from '../utils/tokens';
import { Tx } from '../types/tx';
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
        price.pwrd = NUM.ONE;
        price.gvt = NUM.ZERO;
        price.gro = NUM.ZERO;
        price.weth = NUM.ZERO;
        price.dai = NUM.ZERO;
        price.usdc = NUM.ZERO;
        price.usdt = NUM.ZERO;
        price.balancer_gro_weth = NUM.ZERO;
        price.uniswap_gvt_gro = NUM.ZERO;
        price.uniswap_gro_usdc = NUM.ZERO;
        price.curve_pwrd3crv = NUM.ZERO;
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
    const contract = UniswapV2Pair.bind(ADDR.UNISWAPV2_GVT_GRO);
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
            ADDR.UNISWAPV2_GVT_GRO.toHexString(),
            gvtReserve,
            groReserve,
            totalSupply,
        );

        // update GRO price
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

export const setUniswapGroUsdcPrice = (): void => {
    const contract = UniswapV2Pair.bind(ADDR.UNISWAPV2_GRO_USDC);
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
            ADDR.UNISWAPV2_GRO_USDC.toHexString(),
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
        const oneGroAmount = (NUM.ONE.div(totalSupply)).times(groReserve);
        const oneUsdcAmount = (NUM.ONE.div(totalSupply)).times(usdcReserve);
        const oneGroValue = oneGroAmount.times(price.gro);
        const oneUsdcValue = oneUsdcAmount.times(price.usdc);
        const lpPricePerShare = oneGroValue.plus(oneUsdcValue);
        price.uniswap_gro_usdc = lpPricePerShare.truncate(DECIMALS);
        price.save();
    }
}

export const setCurvePwrd3crvPrice = (): void => {
    const contract = CurveMetapool3CRV.bind(ADDR.CURVE_PWRD_3CRV);
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
            ADDR.CURVE_PWRD_3CRV.toHexString(),
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

//@dev: Gro token was circulating before the GRO/WETH pool creation,
//      so any tx before this creation must be ignored
export const setBalancerGroWethPrice = (tx: Tx): void => {
    const contractVault = BalancerGroWethVault.bind(ADDR.BALANCER_GRO_WETH_VAULT);
    const contractPool = BalancerGroWethPool.bind(ADDR.BALANCER_GRO_WETH_POOL);
    const _totalSupply = contractPool.try_totalSupply();
    const poolTokens = contractVault.try_getPoolTokens(BALANCER_GRO_WETH_POOLID);
    if (tx.block < GENESIS_POOL_GRO_WETH) {
        log.warning(
            `setters/price.ts/setBalancerGroWethPrice()->GRO/WETH Vault updates before its pool creation ${tx.msg}`,
            tx.data
        )
    } else if (_totalSupply.reverted) {
        log.error(
            `setters/price.ts/setBalancerGroWethPrice()->try_totalSupply() reverted ${tx.msg}`,
            tx.data
        );
    } else if (poolTokens.reverted) {
        log.error(
            `setters/price.ts/setBalancerGroWethPrice()->try_getPoolTokens() reverted ${tx.msg}`,
            tx.data
        );
    } else {
        const totalSupply = tokenToDecimal(_totalSupply.value, 18, 12);
        const reserves = poolTokens.value.getBalances().map<BigDecimal>((item: BigInt) => tokenToDecimal(item, 18, 7));
        if (reserves.length !== 2) {
            log.error(`setters/price.ts/setBalancerGroWethPrice(): wrong reserves pair ${tx.msg}`, tx.data);
        } else {
            const groReserve = reserves[0];
            const wethReserve = reserves[1];

            // update Pool data
            updatePoolData(
                5,
                ADDR.BALANCER_GRO_WETH_POOL.toHexString(),
                groReserve,
                wethReserve,
                totalSupply,
            );

            // update lpToken price
            const price = initPrice();
            const oneGro = (NUM.ONE.div(totalSupply)).times(groReserve);
            const oneWeth = (NUM.ONE.div(totalSupply)).times(wethReserve);
            const oneGroValue = oneGro.times(price.gro);
            const oneWethValue = oneWeth.times(price.weth);
            const lpPricePerShare = oneGroValue.plus(oneWethValue);
            price.balancer_gro_weth = lpPricePerShare.truncate(DECIMALS);
            price.save();
        }
    }
}

export const setWethPrice = (): void => {
    const contract = UniswapV2Pair.bind(ADDR.UNISWAPV2_USDC_WETH);
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
        if (contractAddress == ADDR.CHAINLINK_DAI_USD) {
            price.dai = usdPrice;
        } else if (contractAddress == ADDR.CHAINLINK_USDC_USD) {
            price.usdc = usdPrice;
        } else if (contractAddress == ADDR.CHAINLINK_USDT_USD) {
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
